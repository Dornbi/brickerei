// Run once, before cancelling Jimdo:   npm run fetch-images
// Downloads every photo from Jimdo into src/images/ and points the content files at the local copies.
// Safe to run again: photos already downloaded are skipped. Needs Node.js 18 or newer.
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const list = JSON.parse(readFileSync(join(root, 'scripts', 'images.json'), 'utf8'));
const dir = join(root, 'src', 'images');
mkdirSync(dir, { recursive: true });

let ok = 0;
const failed = [];
for (const { url, file } of list) {
  const dest = join(dir, file);
  if (existsSync(dest) && statSync(dest).size > 0) { ok++; continue; }
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
    ok++;
    process.stdout.write(`\r${ok}/${list.length} Fotos heruntergeladen`);
  } catch (e) {
    failed.push(`${file}: ${e.message}`);
  }
}
console.log(`\n${ok}/${list.length} Fotos vorhanden.`);
if (failed.length) {
  console.log('Fehlgeschlagen (Skript einfach nochmals starten):\n' + failed.join('\n'));
  process.exit(1);
}

// Replace the Jimdo addresses with /images/... in all content files.
const walk = (d) => readdirSync(d).flatMap((n) => {
  const p = join(d, n);
  if (n === 'images') return [];
  return statSync(p).isDirectory() ? walk(p) : /\.(md|json)$/.test(n) ? [p] : [];
});
let changed = 0;
for (const file of walk(join(root, 'src'))) {
  let text = readFileSync(file, 'utf8');
  const before = text;
  for (const { url, file: name } of list) text = text.split(url).join('/images/' + name);
  if (text !== before) { writeFileSync(file, text); changed++; }
}
console.log(`${changed} Dateien auf lokale Fotos umgestellt. Fertig!`);
