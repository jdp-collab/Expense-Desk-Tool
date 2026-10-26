// Export-only image processing: originals and image-edit instructions are untouched.
export function pdfImageSize(width,height,mode='readable'){
 const long=Math.max(width,height),short=Math.min(width,height);
 const preferred=mode==='maximum'?1:Math.max(2600/long,1400/short);
 const scale=Math.min(1,preferred,Math.sqrt((mode==='maximum'?24000000:16000000)/(width*height)),(mode==='maximum'?16000:12000)/long);
 return {width:Math.max(1,Math.round(width*scale)),height:Math.max(1,Math.round(height*scale))};
}
function blobFromCanvas(canvas,type,quality){return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('Could not encode the receipt image. Try Maximum detail or a smaller image.')),type,quality));}
export async function preparePdfImage(file,mode='readable'){
 const type=file.editedData?'image/png':file.type,source=file.editedData||file.data;
 if(typeof document==='undefined'||typeof createImageBitmap==='undefined'){
  if(!['image/jpeg','image/png'].includes(type))throw new Error('Image conversion needs the browser.');
  return {bytes:new Uint8Array(source),type};
 }
 const bitmap=await createImageBitmap(new Blob([source],{type}),{imageOrientation:'from-image'}),canvas=document.createElement('canvas');
 try{
  const size=pdfImageSize(bitmap.width,bitmap.height,mode);canvas.width=size.width;canvas.height=size.height;
  const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);
  const png=blobFromCanvas(canvas,'image/png');let encoded;
  if(mode==='maximum')encoded=await png;
  else{const [lossless,jpeg]=await Promise.all([png,blobFromCanvas(canvas,'image/jpeg',.88)]);encoded=jpeg.size<lossless.size?jpeg:lossless;}
  return {bytes:new Uint8Array(await encoded.arrayBuffer()),type:encoded.type,width:size.width,height:size.height};
 }finally{bitmap.close();canvas.width=0;canvas.height=0;}
}
