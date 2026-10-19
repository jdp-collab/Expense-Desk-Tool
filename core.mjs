export const VERSION=1;
export const CATEGORIES=[
 {id:'meal',name:'Meal',reason:'Meal during recruitment travel',sub:'Lunch',code:'travel',pattern:/restaurant|cafe|café|coffee|breakfast|lunch|dinner|grill|bistro|pizza|burger|starbucks|dunkin|meal|bakery|deli|bar\b/i},
 {id:'hotel',name:'Hotel',reason:'Accommodation during recruitment travel',sub:'Hotel',code:'travel',pattern:/hotel|marriott|hilton|hyatt|inn\b|accommodation|lodging/i},
 {id:'taxi',name:'Taxi / rideshare',reason:'Ground transportation during recruitment travel',sub:'Transit',code:'82186 Taxis',pattern:/uber|lyft|taxi|cab\b|rideshare/i},
 {id:'flight',name:'Flight',reason:'Air travel for recruitment activities',sub:'Flight',code:'travel',pattern:/airlines|airways|flight|air canada|aer lingus|ryanair/i},
 {id:'train',name:'Train / public transport',reason:'Public transportation during recruitment travel',sub:'Train',code:'travel',pattern:/amtrak|rail|train|transit|metro|subway|bus ticket/i},
 {id:'parking',name:'Parking / tolls',reason:'Parking during recruitment travel',sub:'Parking',code:'travel',pattern:/parking|parkmobile|toll|ez.?pass/i},
 {id:'car',name:'Rental car / fuel',reason:'Vehicle costs during recruitment travel',sub:'Rental Car',code:'travel',pattern:/hertz|enterprise|avis|budget car|rental car|fuel|gas station|shell\b|chevron/i},
 {id:'fair',name:'College fair / event',reason:'Registration for recruitment event',sub:'Fair Registration',code:'83060 Recruitment Expenses - General',pattern:/college fair|nacac|registration|exhibitor|recruitment event/i},
 {id:'shipping',name:'Shipping',reason:'Shipment of recruitment materials',sub:'Recruitment Materials',code:'82104 Postage/Freight - Outgoing',pattern:/fedex|ups\b|usps|postage|shipment|shipping|dhl/i},
 {id:'materials',name:'Recruitment materials',reason:'Materials for recruitment activities',sub:'Recruitment Materials',code:'83060 Recruitment Expenses - General',pattern:/brochures|recruitment materials|printing/i},
 {id:'other',name:'Other',reason:'',sub:'Other',code:'',pattern:/$^/},
];
export const SUBCATEGORIES=['Offer Holder Event','Conference Registration','Dinner','Lunch','Hotel','Breakfast','Fuel','Rental Car','Parking','Snack/Coffee','Transit','Flight','Train','Airline Fees','Toll','Scanning','Fair Registration','Wire Transfer','Membership Fee','Recruitment Materials','Other'];
export const TRAVEL_CODES={inside:'82201 Travel/Subsistance - Inside EU',outside:'82202 Travel/Subsistance - Outside EU',general:'82203 Travel - Subsistence Expenses'};
export const DEFAULTS=()=>({staff:'',report:'Recruitment travel',costCentre:'17700',dateOrder:'MDY',travelZone:'',defaultCurrency:'',reasons:Object.fromEntries(CATEGORIES.map(c=>[c.id,c.reason]))});
export const cleanText=v=>String(v??'').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'');
export const validDate=v=>/^\d{4}-\d{2}-\d{2}$/.test(v||'')&&!Number.isNaN(Date.parse(v))&&new Date(v+'T12:00:00Z').toISOString().slice(0,10)===v;
export function dateISO(y,m,d){y=Number(y);if(y<100)y+=2000;const s=`${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;return validDate(s)?s:'';}
export function parseAmount(v){
 let s=String(v??'').trim(); if(!s)return null;
 const negative=/^\s*\(|-/.test(s);s=s.replace(/[^\d.,]/g,'');if(!s)return null;
 const lastDot=s.lastIndexOf('.'),lastComma=s.lastIndexOf(',');
 if(lastDot>=0&&lastComma>=0){const decimal=lastDot>lastComma?'.':',';s=s.replace(decimal==='.'?/,/g:/\./g,'').replace(decimal,'.');}
 else if(lastComma>=0){s=/,\d{1,2}$/.test(s)?s.replace(/,/g,(m,o)=>o===lastComma?'.':''):s.replace(/,/g,'');}
 else if((s.match(/\./g)||[]).length>1){s=s.replace(/\./g,(m,o)=>o===lastDot?'.':'');}
 const n=Number(s);return Number.isFinite(n)?(negative?-n:n):null;
}
export function datesFromText(text,order='MDY'){
 const found=[];let ambiguous=false;const add=v=>{if(v&&!found.includes(v))found.push(v);};
 for(const m of text.matchAll(/\b(20\d{2})[-/.](\d{1,2})[-/.](\d{1,2})\b/g))add(dateISO(m[1],m[2],m[3]));
 for(const m of text.matchAll(/\b(\d{1,2})[-/.](\d{1,2})[-/.](20\d{2}|\d{2})\b/g)){
  let a=Number(m[1]),b=Number(m[2]);if(a<=12&&b<=12&&a!==b)ambiguous=true;
  const dayFirst=a>12||(b<=12&&order==='DMY');add(dateISO(m[3],dayFirst?b:a,dayFirst?a:b));
 }
 const months=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
 for(const m of text.matchAll(/\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?\s+(\d{1,2})(?:st|nd|rd|th)?[,]?\s+(20\d{2})\b/gi))add(dateISO(m[3],months.indexOf(m[1].slice(0,3).toLowerCase())+1,m[2]));
 for(const m of text.matchAll(/\b(\d{1,2})\s+(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?[,]?\s+(20\d{2})\b/gi))add(dateISO(m[3],months.indexOf(m[2].slice(0,3).toLowerCase())+1,m[1]));
 return {date:found[0]||'',candidates:found,ambiguous};
}
export function parseReceipt(text,settings=DEFAULTS()){
 text=cleanText(text);const lines=text.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
 const currencies=[];for(const c of ['USD','EUR','GBP','CAD','MXN','AUD','NZD','CHF','JPY','CNY','HKD','SGD','INR','AED','ZAR','SEK','NOK','DKK'])if(new RegExp(`\\b${c}\\b`,'i').test(text))currencies.push(c);
 if(!currencies.length){if(/€/.test(text))currencies.push('EUR');else if(/£/.test(text))currencies.push('GBP');else if(/(?:US\$|\$\s*US)/i.test(text))currencies.push('USD');else if(/(?:CA\$|C\$)/.test(text))currencies.push('CAD');}
 const dates=datesFromText(text,settings.dateOrder);
 const amounts=[];const labelled=[];
 for(let i=0;i<lines.length;i++){
  const line=lines[i];const ms=[...line.matchAll(/(?:[-(]?\s*(?:[$€£]|USD|EUR|GBP|CAD)?\s*\d[\d.,]*[.,]\d{2}\)?)(?!\d)/g)];
  const nums=ms.map(m=>parseAmount(m[0])).filter(n=>n!==null);amounts.push(...nums);
  if(/(?:grand\s*total|amount\s*(?:paid|charged|due)|total\s*(?:paid|charge|incl)|balance\s*paid|^\s*total\b|^\s*paid\b|^\s*sale\b)/i.test(line)&&!/sub\s*total|tax\s*total|total\s*(?:tax|saving|discount|change|points)/i.test(line)){
   let n=nums.at(-1);if(n===undefined&&i+1<lines.length)n=parseAmount(lines[i+1]);
   if(n!==undefined&&n!==null)labelled.push(n);
  }
 }
 const category=CATEGORIES.find(c=>c.pattern.test(lines.slice(0,14).join('\n')))?.id||'other';
 const merchant=lines.slice(0,8).find(s=>/[a-z]{2}/i.test(s)&&!/@|https?:|www\.|receipt|invoice|transaction|^date\b|^tel\b|^phone\b|^order\b|^tax\b|^thank you|^customer|^\s*(?:\d+[ -]?){4,}/i.test(s))?.slice(0,120)||'';
 const issues=[];if(dates.ambiguous)issues.push(`Ambiguous numeric date; interpreted as ${settings.dateOrder}. Check the expense date.`);if(dates.candidates.length>1)issues.push('Multiple dates found; check the transaction date.');if(!dates.date)issues.push('Date not found.');
 if(currencies.length>1)issues.push('Multiple currencies found.');if(!currencies.length)issues.push(/\$/.test(text)?'Dollar symbol does not identify the currency.':'Currency not found.');
 if(!labelled.length)issues.push(amounts.length?'No labelled total; amount needs checking.':'Total not found.');
 if(new Set(labelled).size>1)issues.push('Multiple totals found; check tip and final amount paid.');
 return {merchant,date:dates.date,amount:labelled.at(-1)??null,currency:currencies.length===1?currencies[0]:'',category,issues,amountCandidates:[...new Set([...labelled,...amounts])].slice(0,30),dateCandidates:dates.candidates};
}
export const categoryFor=id=>CATEGORIES.find(c=>c.id===id)||CATEGORIES.at(-1);
export function codeFor(category,settings){const c=categoryFor(category);return c.code==='travel'?(TRAVEL_CODES[settings.travelZone]||''):c.code;}
export function usdAmount(r){const a=parseAmount(r.amount);const override=parseAmount(r.cardUSD);if(override!==null)return round(override);if(a===null)return null;if(r.currency==='USD')return round(a);const rate=parseAmount(r.rate);return rate!==null&&rate>0?round(a*rate):null;}
export const round=n=>Math.round((n+Math.sign(n)*Number.EPSILON)*100)/100;
export const sorted=rows=>[...rows].sort((a,b)=>(validDate(a.date)?a.date:'9999-99-99').localeCompare(validDate(b.date)?b.date:'9999-99-99')||(Number(a.seq)-Number(b.seq))||String(a.id).localeCompare(String(b.id)));
export function issuesFor(r){const issues=[];if(!validDate(r.date))issues.push('Set expense date');if(!r.merchant?.trim())issues.push('Set merchant');if(!r.description?.trim())issues.push('Set business reason');if(!r.code)issues.push('Choose expense code');if(!r.subcategory)issues.push('Choose subcategory');if(!['Yes','No'].includes(r.itemized))issues.push('Check itemized receipt');if(!/^[A-Z]{3}$/.test(r.currency||''))issues.push('Set currency');if(parseAmount(r.amount)===null)issues.push('Set original amount');if(usdAmount(r)===null)issues.push('Set exchange rate or USD card charge');if(!r.costCentre?.trim())issues.push('Set cost centre');if(!r.files?.length)issues.push('Attach receipt');if(r.processing)issues.push('Wait for receipt processing');if(r.error)issues.push('Resolve file reading error');return issues;}
export function exportRows(rows,scope='confirmed'){return sorted(rows.filter(r=>r.status!=='Excluded'&&(scope==='all'||r.status==='Confirmed')));}
export function excelSerial(date){return validDate(date)?Math.round((Date.parse(date+'T00:00:00Z')-Date.UTC(1899,11,30))/86400000):null;}
export function dateDisplay(date){if(!validDate(date))return 'Date needed';return new Intl.DateTimeFormat('en-GB',{day:'2-digit',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(date+'T12:00:00Z'));}
export const money=v=>v===null?'—':new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(v);
