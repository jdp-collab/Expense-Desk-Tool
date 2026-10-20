// Dependencies are loaded from this module's directory, including project subfolders.
export const BUILD='1.2.0';
export const assetURL=name=>new URL(`./assets/${name}`,import.meta.url).href;
const pendingScripts=new Map();
export async function loadScript(name,globalName){
 if(globalThis[globalName])return globalThis[globalName];
 if(pendingScripts.has(name))return pendingScripts.get(name);
 const promise=new Promise((resolve,reject)=>{
  const script=document.createElement('script');let timer;
  const fail=()=>{clearTimeout(timer);script.remove();reject(new Error(`Receipt tool file could not load: assets/${name}. Upload the complete assets folder, then reload. You can still enter and confirm expense details manually.`));};
  script.src=assetURL(name)+`?v=${BUILD}`;script.async=true;
  script.onload=()=>{clearTimeout(timer);globalThis[globalName]?resolve(globalThis[globalName]):fail();};script.onerror=fail;
  timer=setTimeout(fail,20000);document.head.append(script);
 });
 pendingScripts.set(name,promise);
 try{return await promise;}catch(e){pendingScripts.delete(name);throw e;}
}
let pdfPromise;
export async function pdfModule(){
 if(!pdfPromise)pdfPromise=import(assetURL('pdf.min.js')+`?v=${BUILD}`).then(p=>{p.GlobalWorkerOptions.workerSrc=assetURL('pdf.worker.min.js')+`?v=${BUILD}`;return p;}).catch(()=>{pdfPromise=null;throw new Error('PDF preview tools could not load. Check that assets/pdf.min.js and assets/pdf.worker.min.js were uploaded. You can open the original PDF and enter the expense manually.');});
 return pdfPromise;
}
export async function loadPdf(data){
 const p=await pdfModule();return p.getDocument({data:new Uint8Array(data.slice(0)),standardFontDataUrl:assetURL('standard_fonts/'),isEvalSupported:false}).promise;
}
export async function checkReceiptTools(){
 const files=['tesseract.min.js','worker.min.js','tesseract-core-lstm.wasm.js','eng.traineddata','pdf.min.js','pdf.worker.min.js','pdf-lib.min.js','jszip.min.js','expense-template.xlsx','codes.json'];
 return Promise.all(files.map(async name=>{
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);
  try{const response=await fetch(assetURL(name),{method:'HEAD',cache:'no-store',signal:controller.signal});return {name,ok:response.ok,status:response.status};}
  catch{return {name,ok:false,status:'unavailable'};}finally{clearTimeout(timer);}
 }));
}
export async function ensureExports(){await Promise.all([loadScript('jszip.min.js','JSZip'),loadScript('pdf-lib.min.js','PDFLib')]);}
