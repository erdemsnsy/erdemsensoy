const fs=require('fs');
const base='_extract/design_handoff_portfolyo_08dijital/';
for (const [f,o] of [['Portfolyo.dc.html','lib/en-portfolio.json'],['Freelance.dc.html','lib/en-freelance.json']]) {
  const s=fs.readFileSync(base+f,'utf8');
  const i=s.indexOf('EN = {')+5; let depth=0,j=i;
  for(;j<s.length;j++){ if(s[j]==='{')depth++; else if(s[j]==='}'){depth--; if(!depth)break;} }
  const obj=JSON.parse(s.slice(i,j+1));
  fs.writeFileSync(o,JSON.stringify(obj,null,1)+'\n');
  console.log(o,Object.keys(obj).length);
}
