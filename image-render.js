export function normalizeEditState(input){
 const rotation=[0,90,180,270].includes(Number(input?.rotation))?Number(input.rotation):0;
 const coord=v=>Math.max(0,Math.min(1,Number(v)||0));const marks=[];let totalPoints=0;
 for(const m of (Array.isArray(input?.marks)?input.marks:[]).slice(0,500)){
  if(!m||!['pen','box','highlight','text'].includes(m.tool))continue;
  const mark={tool:m.tool,color:/^#[\da-f]{6}$/i.test(m.color)?m.color:'#b53336',width:Math.max(.001,Math.min(.04,Number(m.width)||.004)),x:coord(m.x),y:coord(m.y),x2:coord(m.x2),y2:coord(m.y2)};
  if(m.tool==='pen'){mark.points=(Array.isArray(m.points)?m.points:[]).slice(0,Math.min(2000,20000-totalPoints)).filter(p=>Array.isArray(p)&&p.length===2).map(p=>p.map(coord));totalPoints+=mark.points.length;if(!mark.points.length)continue;}
  if(m.tool==='text'){mark.angle=[0,90,180,270].includes(Number(m.angle))?Number(m.angle):0;mark.text=String(m.text??'').slice(0,160);if(!mark.text.trim())continue;}marks.push(mark);
 }return {rotation,marks};
}
export function canvasPoint(x,y,rotation){if(rotation===90)return [y,1-x];if(rotation===180)return [1-x,1-y];if(rotation===270)return [1-y,x];return [x,y];}
export function paintImage(bitmap,input,canvas,{maxEdge=3500,minEdge=0,includeMarks=true}={}){
 const state=normalizeEditState(input),dimension=Math.max(bitmap.width,bitmap.height),scale=Math.min(maxEdge/dimension,Math.max(1,minEdge/dimension)),w=Math.max(1,Math.round(bitmap.width*scale)),h=Math.max(1,Math.round(bitmap.height*scale));const turn=state.rotation===90||state.rotation===270,cw=turn?h:w,ch=turn?w:h;
 if(canvas.width!==cw)canvas.width=cw;if(canvas.height!==ch)canvas.height=ch;
 const ctx=canvas.getContext('2d');ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.fillStyle='#fff';ctx.fillRect(0,0,cw,ch);ctx.save();
 if(state.rotation===90){ctx.translate(h,0);ctx.rotate(Math.PI/2);}else if(state.rotation===180){ctx.translate(w,h);ctx.rotate(Math.PI);}else if(state.rotation===270){ctx.translate(0,w);ctx.rotate(-Math.PI/2);}
 ctx.drawImage(bitmap,0,0,w,h);
 if(includeMarks)for(const m of state.marks){ctx.save();ctx.strokeStyle=m.color;ctx.fillStyle=m.color;ctx.lineWidth=Math.max(1,m.width*w);ctx.lineJoin='round';ctx.lineCap='round';
  if(m.tool==='pen'){ctx.beginPath();m.points.forEach(([x,y],i)=>i?ctx.lineTo(x*w,y*h):ctx.moveTo(x*w,y*h));if(m.points.length===1){ctx.lineTo(m.points[0][0]*w+.01,m.points[0][1]*h+.01);}ctx.stroke();}
  else if(m.tool==='box')ctx.strokeRect(m.x*w,m.y*h,(m.x2-m.x)*w,(m.y2-m.y)*h);
  else if(m.tool==='highlight'){ctx.globalAlpha=.28;ctx.fillRect(m.x*w,m.y*h,(m.x2-m.x)*w,(m.y2-m.y)*h);}
  else{const size=Math.max(12,w*m.width*7);ctx.font=`600 ${size}px Arial, sans-serif`;ctx.textBaseline='top';const words=m.text.split(/\s+/),lines=[];let line='';const available=Math.max(60,(m.angle===90?(1-m.y)*h:m.angle===180?m.x*w:m.angle===270?m.y*h:(1-m.x)*w)-10);ctx.translate(m.x*w,m.y*h);ctx.rotate((m.angle||0)*Math.PI/180);for(const word of words){if(ctx.measureText(line+' '+word).width>available&&line){lines.push(line);line=word;}else line+=(line?' ':'')+word;}if(line)lines.push(line);lines.forEach((l,i)=>ctx.fillText(l,0,i*size*1.2));}ctx.restore();
 }ctx.restore();return canvas;
}
export async function renderImage(file,{maxEdge=3500,minEdge=0,includeMarks=true,state=file.editState}={}){const bitmap=await createImageBitmap(new Blob([file.data],{type:file.type}),{imageOrientation:'from-image'});try{return paintImage(bitmap,state,document.createElement('canvas'),{maxEdge,minEdge,includeMarks});}finally{bitmap.close();}}
export async function encodeCanvas(canvas){const blob=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('Could not save this image. Try a smaller image.')),'image/png'));return blob.arrayBuffer();}
export const hasImageEdits=state=>{const s=normalizeEditState(state);return s.rotation!==0||s.marks.length>0;};
