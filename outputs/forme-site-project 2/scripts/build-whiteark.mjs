import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'src/pages');
const dist = path.join(root, 'dist');
const site = JSON.parse(await readFile(path.join(root, 'src/data/site.json'), 'utf8'));

function sharedAdjustments(html) {
  return html
    .replaceAll('studio@forme.example', site.quoteRecipient)
    .replace('href="#shop">Request a quote', 'href="#quote">Request a quote');
}

function homepage(html) {
  return sharedAdjustments(html)
    .replaceAll('href="products.html', 'href="products/')
    .replaceAll('href="index.html', 'href="./');
}

function catalogue(html) {
  return sharedAdjustments(html)
    .replaceAll('href="index.html', 'href="../')
    .replaceAll('href="products.html', 'href="./');
}

const notFound = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found · FORME.</title><style>body{margin:0;background:#f7f7f5;color:#111;font-family:Arial,sans-serif;display:grid;min-height:100vh;place-items:center;text-align:center}h1{font-size:clamp(80px,18vw,240px);letter-spacing:-.09em;margin:0}a{color:inherit;text-transform:uppercase;font-size:11px}</style></head><body><main><h1>404</h1><p>The object you requested could not be found.</p><p><a href="./">Return home →</a></p></main></body></html>`;

await rm(dist, { recursive: true, force: true });
await mkdir(path.join(dist, 'products'), { recursive: true });

const homeHtml = homepage(await readFile(path.join(source, 'index.html'), 'utf8'));
const productsHtml = catalogue(await readFile(path.join(source, 'products.html'), 'utf8'));

await writeFile(path.join(dist, 'index.html'), homeHtml);
await writeFile(path.join(dist, 'products/index.html'), productsHtml);
await writeFile(path.join(dist, 'products.html'), productsHtml.replaceAll('href="../', 'href="./'));
await writeFile(path.join(dist, '404.html'), notFound);
await writeFile(path.join(dist, '.nojekyll'), '');

console.log('Built the White Ark homepage and 89-object catalogue in dist/');
