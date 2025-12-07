const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname);
const files = fs.readdirSync(distDir)
  .filter(f => /^[a-zA-Z0-9]+\.js$/.test(f) && f !== 'benchmark.js')
  .sort();

console.log(`Found ${files.length} script(s): ${files.join(', ')}\n`);
console.log('File                  Time (ms)');
console.log('----------------------------------');

let totalNs = 0n;

for (const file of files) {
  const filepath = path.join(distDir, file);

  const start = process.hrtime.bigint();
  require(filepath);
  const end = process.hrtime.bigint();

  const durationNs = end - start;
  totalNs += durationNs;

  const durationMs = Number(durationNs) / 1e6;
  console.log(`${file.padEnd(20)} ${durationMs.toFixed(3)} ms`);
}

const totalMs = Number(totalNs) / 1e6;
console.log('----------------------------------');
console.log(`Total time   ${totalMs.toFixed(3)} ms`);
