export const PROFILE_FIELDS={category:'Category',description:'Business justification',code:'Expense code',subcategory:'Subcategory',costCentre:'Cost centre',currency:'Currency (optional)',itemized:'Itemized receipt? (optional)'};
export const normalizeMerchant=name=>String(name??'').normalize('NFKC').toLowerCase().replace(/\s+/g,' ').trim();
export function normalizeProfiles(input){
 if(!Array.isArray(input))return [];
 const used=new Set();return input.slice(0,200).flatMap(p=>{
  if(!p||typeof p!=='object')return [];const name=String(p.name??'').trim().slice(0,160);if(!name)return [];
  const aliases=Array.isArray(p.aliases)?p.aliases.map(s=>String(s).trim().slice(0,160)).filter(Boolean).slice(0,20):[];
  const keys=[...new Set([name,...aliases].map(normalizeMerchant))];if(keys.some(k=>used.has(k)))return [];
  const fields={};for(const key of Object.keys(PROFILE_FIELDS))if(typeof p.fields?.[key]==='string'&&p.fields[key].trim())fields[key]=p.fields[key].trim().slice(0,key==='description'?1000:160);
  if(!Object.keys(fields).length)return [];keys.forEach(k=>used.add(k));return [{id:String(p.id??normalizeMerchant(name)).slice(0,180),name,aliases,fields,revision:Number(p.revision)||1}];
 });
}
export function findProfile(name,profiles){const key=normalizeMerchant(name);return key?profiles.find(p=>[p.name,...p.aliases].some(s=>normalizeMerchant(s)===key)):undefined;}
export function applyProfile(row,profile,{force=false}={}){
 if(!profile)return [];const beforeCurrency=row.currency,prior=row.merchantDefaults?.profileId===profile.id?row.merchantDefaults.applied:null,changed=[];
 const applied={...prior};for(const [key,value] of Object.entries(profile.fields)){
  if(!Object.hasOwn(PROFILE_FIELDS,key))continue;
  if(force||!row[key]||(prior&&Object.hasOwn(prior,key)&&String(row[key])===String(prior[key]))){if(row[key]!==value){row[key]=value;changed.push(key);}applied[key]=value;}
 }
 row.merchantDefaults={profileId:profile.id,revision:profile.revision,applied};
 if(beforeCurrency!==row.currency){row.rate='';row.rateDate='';row.rateSource='';row.cardUSD='';}
 if(changed.length&&row.status==='Confirmed')row.status='Needs review';return changed;
}
