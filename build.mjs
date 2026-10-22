/**
 * Build step: inline every sprite sheet into the client bundle as a data URI.
 *
 * The plugin ships no host half, so nothing can serve the sheets over HTTP; the
 * browser bundle has to carry them. Total payload is about 555 KB of base64,
 * which is well under the module route's limit and avoids 18 extra requests.
 *
 * Run from the package directory: `node build.mjs`
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const here = import.meta.dirname;
const assetsDir = join(here, 'assets');

const files = (await readdir(assetsDir)).filter((name) => name.endsWith('.png')).sort();
if (files.length === 0) throw new Error('build: no sheets in assets/');

const entries = [];
for (const file of files) {
  const key = file.slice(0, -4);
  const bytes = await readFile(join(assetsDir, file));
  entries.push(`    '${key}': 'data:image/png;base64,${bytes.toString('base64')}',`);
}

const literal = `{\n${entries.join('\n')}\n  }`;
const template = await readFile(join(here, 'client.template.js'), 'utf8');
if (!template.includes('__SHEET_DATA__')) throw new Error('build: template placeholder missing');

const bundle = template.replace('__SHEET_DATA__', literal);
if (bundle.includes('__SHEET_DATA__')) throw new Error('build: placeholder not replaced');

await writeFile(join(here, 'client.js'), bundle, 'utf8');
const kb = Math.round(Buffer.byteLength(bundle) / 1024);
console.log(`build: ${files.length} sheets inlined, client.js ${kb} KB`);
