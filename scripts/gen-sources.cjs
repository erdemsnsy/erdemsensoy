// lib/portfolio-logic.ts içindeki `// @src:<ad>` ... `// @src:end` bloklarını "kaynak kodu" paneli için string olarak dışa aktarır.
const fs = require('fs');
const src = fs.readFileSync('lib/portfolio-logic.ts', 'utf8').replace(/\r\n/g, '\n');
const out = {};
const re = /\/\/ @src:(\w+)\n([\s\S]*?)\n\/\/ @src:end/g;
let m;
while ((m = re.exec(src))) out[m[1]] = m[2];
const order = ['hero', 'stack', 'palette', 'theme'];
const body = '// Otomatik üretilir: npm run gen\nexport const SOURCES: string[] = ' + JSON.stringify(order.map(k => out[k]), null, 2) + ';\n';
fs.writeFileSync('lib/sources.generated.ts', body);
console.log(order.map(k => k + ':' + (out[k] || '').split('\n').length).join(' '));
