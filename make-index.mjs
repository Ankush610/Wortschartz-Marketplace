// Regenerates index.json — the catalogue the app fetches to list the packs.
// Run `node make-index.mjs` from this directory after adding or editing a pack.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';

const packs = readdirSync('.')
  .filter(f => f.endsWith('.json') && f !== 'index.json')
  .sort()
  .map(f => ({ name: f.slice(0, -'.json'.length), count: JSON.parse(readFileSync(f, 'utf8')).words.length }));

writeFileSync('index.json', JSON.stringify(packs, null, 2) + '\n');
console.log(packs.length + ' packs, ' + packs.reduce((n, p) => n + p.count, 0) + ' words');
