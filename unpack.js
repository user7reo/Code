// Rebuilds the full CODEX project from the 3 bundle-*.json files.
// Usage:  node unpack.js
const fs = require('fs'), path = require('path');
let n = 0;
for (const f of fs.readdirSync(__dirname).filter((x) => /^bundle-.*\.json$/.test(x))) {
  const files = JSON.parse(fs.readFileSync(path.join(__dirname, f), 'utf8'));
  for (const [rel, content] of Object.entries(files)) {
    const dest = path.resolve(__dirname, 'codex', rel);
    if (!dest.startsWith(path.resolve(__dirname, 'codex') + path.sep)) throw new Error('bad path ' + rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, content); n++;
  }
}
console.log('Created ' + n + ' files in ./codex');
console.log('Next: cd codex && cp .env.example .env && npm install');
