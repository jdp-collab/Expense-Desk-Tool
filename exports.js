import {sorted,exportRows,usdAmount,parseAmount,excelSerial,dateDisplay,cleanText,validDate,issuesFor,businessJustification,itemizedValue,needsReceiptReason} from './core.js?v=1.4.0';
const xmlEscape=v=>cleanText(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
const colName=i=>{let out='';for(i++;i;i=Math.floor((i-1)/26))out=String.fromCharCode(65+(i-1)%26)+out;return out;};
export function replaceCells(xml,entries){
 const byAddress=new Map(entries.map(e=>[e[0],e]));
 const prefix=(xml.match(/<((?:\w+:)?)worksheet\b/)||[])[1]||'';
 const render=(ref,attrs,v,formula)=>{
  attrs=attrs.replace(/\s+t="[^"]*"/g,'');
  if(v===null||v===undefined||v==='')return `<${prefix}c${attrs}/>`;
  if(formula)return `<${prefix}c${attrs}><${prefix}f>${xmlEscape(formula.replace(/^=/,''))}</${prefix}f><${prefix}v>${Number(v)}</${prefix}v></${prefix}c>`;
  if(typeof v==='number'&&Number.isFinite(v))return `<${prefix}c${attrs}><${prefix}v>${v}</${prefix}v></${prefix}c>`;
  return `<${prefix}c${attrs} t="inlineStr"><${prefix}is><${prefix}t xml:space="preserve">${xmlEscape(String(v).slice(0,32760))}</${prefix}t></${prefix}is></${prefix}c>`;
 };
 xml=xml.replace(/<(?:\w+:)?c\b([^>]*?)(?:\/>|>[\s\S]*?<\/(?:\w+:)?c>)/g,(full,attrs)=>{
  const ref=attrs.match(/\br="([^"]+)"/)?.[1];if(!byAddress.has(ref))return full;
  const [,v,f]=byAddress.get(ref);byAddress.delete(ref);return render(ref,attrs,v,f);
 });
 // The authored template reserves every export cell; fail visibly if its shape changes.
 if(byAddress.size)throw new Error(`Template cells unavailable: ${[...byAddress.keys()].slice(0,5).join(', ')}`);
 return xml;
}
function reportValues(r,item,forFinal=false){const currency=forFinal?(r.currency==='USD'?'':r.currency==='CAD'?'CAN':r.currency):r.currency;return [item,excelSerial(r.date),r.merchant,businessJustification(r),r.code,r.subcategory,itemizedValue(r),r.currency==='USD'?null:parseAmount(r.amount),usdAmount(r),currency,r.costCentre];}
export function validateExport(rows,scope,forPdf=false){
 const selected=exportRows(rows,scope);
 if(!selected.length)throw new Error(scope==='confirmed'?'Confirm at least one expense first.':'Add at least one included expense first.');
 if(rows.length>500)throw new Error('This version supports 500 expenses per report.');
 if(forPdf){const missing=selected.find(r=>!validDate(r.date)||r.processing);if(missing)throw new Error(`Check the date and wait for processing to finish for ${missing.merchant||'an expense'} before creating a matched PDF.`);}
 return selected;
}
export async function buildExcel(rows,settings,scope,templateBytes,batch){
 if(rows.length>500)throw new Error('This version supports 500 expenses per report.');
 const zip=await globalThis.JSZip.loadAsync(templateBytes);
 const reviewPath='xl/worksheets/sheet4.xml',readyPath='xl/worksheets/sheet5.xml';
 const selected=exportRows(rows,scope), numbers=new Map(selected.map((r,i)=>[r.id,i+1]));
 const reviewEdits=[],readyEdits=[];
 const sortedRows=sorted(rows);
 sortedRows.forEach((r,i)=>{
  const n=i+8;
  const readingNote=r.error?`${r.manualEntry?'Manually reviewed. ':''}Reading note: ${r.error}`:'';
  const values=[...reportValues(r,numbers.get(r.id)||null),r.status,[...(r.status==='Confirmed'?[]:r.extracted?.issues||[]),...issuesFor(r),...(readingNote?[readingNote]:[]),...(!r.files.length?['No receipt attached; see the missing-receipt explanation in Business Justification.']:[])].join(' '),r.files.length?r.files.map(f=>f.name+(f.editedData?' [edited image]':'')).join('; '):'No receipt attached',r.extracted?.merchant||'',r.extracted?.date||'',r.extracted?.amount??null,r.extracted?.currency||'',r.category,parseAmount(r.rate),excelSerial(r.rateDate),parseAmount(r.amount),parseAmount(r.cardUSD),r.rateSource||'',r.notes||'',r.text||'',r.id,batch];
  values.forEach((v,j)=>reviewEdits.push([`${colName(j)}${n}`,v,j===8&&usdAmount(r)!==null?`IF(V${n}="","",IF(W${n}<>"",W${n},IF(J${n}="USD",V${n},IF(ISNUMBER(T${n}),ROUND(V${n}*T${n},2),""))))`:null]));
 });
 // Remove unused pre-authored calculation rows; keep all original template formats.
 for(let n=sortedRows.length+8;n<=507;n++)reviewEdits.push([`I${n}`,null]);
 selected.forEach((r,i)=>reportValues(r,i+1,true).forEach((v,j)=>readyEdits.push([`${colName(j)}${i+5}`,v])));
 readyEdits.push(['A2',scope==='confirmed'?'Confirmed expenses to copy':'Draft expenses to copy (not all confirmed)']);
 readyEdits.push(['A3',`${selected.length} expenses. Batch ${batch}. Copy A5:K${selected.length+4} and Paste Values into Expenses!A12. Template capacity: 50 rows.${selected.length>50?' Use multiple reports; do not overwrite the total row.':''}`]);
 reviewEdits.push(['A4',`Batch ${batch}. Receipt PDF item numbers match Ready to Copy. Unselected records have no item number.`]);
 zip.file(reviewPath,replaceCells(await zip.file(reviewPath).async('string'),reviewEdits));
 zip.file(readyPath,replaceCells(await zip.file(readyPath).async('string'),readyEdits));
 // Set report owner only when supplied. Bank and mileage fields remain the template's fields.
 if(settings.staff){const p='xl/worksheets/sheet1.xml';let x=await zip.file(p).async('string');x=replaceCells(x,[['C3',settings.staff]]);zip.file(p,x);}
 return zip.generateAsync({type:'uint8array',compression:'DEFLATE'});
}
function pdfText(v,max=180){return cleanText(v).replace(/[^\x20-\x7e\xa0-\xff]/g,'?').slice(0,max);}
function wrap(text,width,font,size){
 const out=[];for(const inputLine of cleanText(text).split(/\r?\n/)){
  let line='';for(const w of pdfText(inputLine,32760).split(/\s+/)){
   if(font.widthOfTextAtSize(line+' '+w,size)>width&&line){out.push(line);line=w;}else line+=(line?' ':'')+w;
   while(font.widthOfTextAtSize(line,size)>width){let cut=line.length;while(cut>1&&font.widthOfTextAtSize(line.slice(0,cut),size)>width)cut--;out.push(line.slice(0,cut));line=line.slice(cut);}
  }out.push(line);
 }return out;
}
export async function buildPdf(rows,settings,scope,batch,progress=()=>{}){
 const selected=validateExport(rows,scope,true);
 const {PDFDocument,StandardFonts,rgb,degrees}=globalThis.PDFLib;
 const doc=await PDFDocument.create();doc.setTitle(`${settings.report||'Expense receipts'} - ${batch}`);doc.setAuthor(settings.staff||'UCD Expense Desk');
 const font=await doc.embedFont(StandardFonts.Helvetica),bold=await doc.embedFont(StandardFonts.HelveticaBold);
 const navy=rgb(.016,.125,.298),gray=rgb(.35,.39,.45),paper=[595.28,841.89];
 const caption=(page,r,item,part,total)=>{
  const w=page.getWidth(),h=page.getHeight();
  page.drawText(`ITEM ${String(item).padStart(3,'0')}  |  ${dateDisplay(r.date)}  |  ${pdfText(r.merchant,55)}`,{x:26,y:h-27,size:10,font:bold,color:navy});
  page.drawText(`${r.status==='Confirmed'?'Confirmed':'DRAFT - NEEDS REVIEW'}  |  ${pdfText(r.currency,3)} ${parseAmount(r.amount)??'?'}  |  USD ${usdAmount(r)?.toFixed(2)??'unconfirmed'}  |  Page ${part}/${total}`,{x:26,y:h-43,size:8,font,color:gray});
  page.drawText(pdfText(r.description,100),{x:26,y:h-58,size:8,font,color:gray});
  page.drawText(`UCD Expense Desk  |  ${pdfText(batch)}  |  ${scope==='confirmed'?'Confirmed expenses':'All included expenses'}`,{x:26,y:15,size:7,font,color:gray});
 };
 const missingReceiptPages=(r,item)=>{
  const noReceipt=!r.files?.length,title=noReceipt?'NO RECEIPT ATTACHED':'ITEMIZED RECEIPT UNAVAILABLE';
  const text=`${businessJustification(r)}\n\n${noReceipt?'No receipt was supplied for this expense.':'The attached document(s) have been marked as not itemized.'} This explanation was entered by the user. This page is not a receipt or approval of reimbursement.`;
  const lines=wrap(text,paper[0]-60,font,10),perPage=55,count=Math.max(1,Math.ceil(lines.length/perPage));
  for(let part=0;part<count;part++){const page=doc.addPage(paper);caption(page,r,item,part+1,count);page.drawText(title,{x:30,y:paper[1]-93,font:bold,size:12,color:navy});lines.slice(part*perPage,(part+1)*perPage).forEach((line,k)=>page.drawText(line,{x:30,y:paper[1]-122-k*12,font,size:10,color:navy}));}
 };
 for(let i=0;i<selected.length;i++){
  const r=selected[i];progress(`Preparing expense ${i+1} of ${selected.length}`);
  if(needsReceiptReason(r))missingReceiptPages(r,i+1);
  for(const file of r.files||[]){
   const edited=!!file.editedData&&file.type.startsWith('image/'),imageType=edited?'image/png':file.type;
   const bytes=new Uint8Array(edited?file.editedData:file.data);
   if(file.type==='application/pdf'||/\.pdf$/i.test(file.name)){
    let source;try{source=await PDFDocument.load(bytes);}catch{throw new Error(`Cannot combine ${file.name}. Remove PDF encryption or replace the file.`);}
    const pages=await doc.embedPdf(source,source.getPageIndices());
    pages.forEach((embedded,j)=>{
     const rotation=((source.getPage(j).getRotation().angle%360)+360)%360;
     const turn=rotation===90||rotation===270,visualWidth=turn?embedded.height:embedded.width,visualHeight=turn?embedded.width:embedded.height;
     const w=Math.max(paper[0],visualWidth+52),h=Math.max(paper[1],visualHeight+110),page=doc.addPage([w,h]);
     const scale=Math.min((w-52)/visualWidth,(h-110)/visualHeight),left=(w-visualWidth*scale)/2,bottom=34+(h-110-visualHeight*scale)/2;
     const x=left+(rotation===180?embedded.width*scale:rotation===270?embedded.height*scale:0),y=bottom+(rotation===90?embedded.width*scale:rotation===180?embedded.height*scale:0);
     page.drawPage(embedded,{x,y,width:embedded.width*scale,height:embedded.height*scale,rotate:degrees(-rotation)});caption(page,r,i+1,j+1,pages.length);
    });
   }else if(file.type.startsWith('image/')){
    let imageBytes=bytes;
    // JPEG and PNG are embedded directly; web formats are normalized in the browser.
    if(typeof document!=='undefined'||!/image\/(jpeg|png)/.test(imageType)){
     if(typeof document==='undefined')throw new Error('Image conversion needs the browser.');
     const bitmap=await createImageBitmap(new Blob([bytes],{type:imageType}),{imageOrientation:'from-image'});const canvas=document.createElement('canvas');const factor=Math.min(1,3500/Math.max(bitmap.width,bitmap.height));canvas.width=Math.round(bitmap.width*factor);canvas.height=Math.round(bitmap.height*factor);canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();imageBytes=new Uint8Array(await (await new Promise(res=>canvas.toBlob(res,'image/png'))).arrayBuffer());canvas.width=0;canvas.height=0;
    }
    let image;try{image=imageType==='image/jpeg'&&typeof document==='undefined'?await doc.embedJpg(imageBytes):await doc.embedPng(imageBytes);}catch{throw new Error(`Cannot combine ${file.name}. Try saving it as a JPEG or PNG.`);}
    const page=doc.addPage(paper),scale=Math.min((paper[0]-52)/image.width,(paper[1]-110)/image.height);
    page.drawImage(image,{x:(paper[0]-image.width*scale)/2,y:34+(paper[1]-110-image.height*scale)/2,width:image.width*scale,height:image.height*scale});caption(page,r,i+1,1,1);
   }else{
    const text=file.text||new TextDecoder().decode(bytes);const lines=wrap(text,paper[0]-60,font,10);const perPage=57;const count=Math.max(1,Math.ceil(lines.length/perPage));
    for(let j=0;j<count;j++){const page=doc.addPage(paper);caption(page,r,i+1,j+1,count);page.drawText(pdfText(file.name,100),{x:30,y:paper[1]-85,font:bold,size:9,color:gray});lines.slice(j*perPage,(j+1)*perPage).forEach((line,k)=>page.drawText(line,{x:30,y:paper[1]-105-k*12,font,size:10,color:navy}));}
   }
  }
 }
 return doc.save();
}
export function download(bytes,name,type){const blob=bytes instanceof Blob?bytes:new Blob([bytes],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);}

export async function buildBackup(rows,settings,merchantProfiles=[]){
 const zip=new globalThis.JSZip(),manifest={version:1,appVersion:'1.4.0',settings,merchantProfiles,rows:[]};
 for(let i=0;i<rows.length;i++){const row=rows[i],copy={...row,processing:false,files:[]};for(let j=0;j<row.files.length;j++){const file=row.files[j],path=`receipts/${i}/${j}`,editedPath=file.editedData?`receipts/${i}/${j}-edited.png`:undefined;zip.file(path,file.data);if(editedPath)zip.file(editedPath,file.editedData);copy.files.push({...file,data:undefined,editedData:undefined,path,editedPath});}manifest.rows.push(copy);}
 zip.file('report.json',JSON.stringify(manifest));return zip.generateAsync({type:'uint8array',compression:'DEFLATE'});
}
