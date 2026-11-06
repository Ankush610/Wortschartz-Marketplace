// Regenerates index.json — the catalogue the app fetches to list the packs.
// The index workflow runs this on every push; run `node make-index.mjs` yourself
// before testing a pack locally, since the app's dataset test checks the index.
//
// `hash` is the SHA-256 of the pack file's bytes. On launch the app compares it
// with the hash of the copy it last applied and only downloads packs that moved,
// so a launch costs one request however many packs exist. The app hashes the
// text it downloads the same way, so the two must stay plain SHA-256 hex.
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';

const packs = readdirSync('.')
  .filter(f => f.endsWith('.json') && f !== 'index.json')
  .sort()
  .map(f => {
    const bytes = readFileSync(f);
    return {
      name: f.slice(0, -'.json'.length),
      count: JSON.parse(bytes.toString('utf8')).words.length,
      hash: createHash('sha256').update(bytes).digest('hex'),
    };
  });

writeFileSync('index.json', JSON.stringify(packs, null, 2) + '\n');
console.log(packs.length + ' packs, ' + packs.reduce((n, p) => n + p.count, 0) + ' words');
