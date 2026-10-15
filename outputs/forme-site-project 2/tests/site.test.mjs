import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve('.');
const products = JSON.parse(await readFile(path.join(root, 'src/data/products.json'), 'utf8'));
execFileSync(process.execPath, ['scripts/build.mjs'], { cwd: root });

test('build creates every required route', async () => {
  const routes = ['index.html', 'products/index.html', 'quote/index.html', '404.html', ...products.map((product) => `products/${product.slug}/index.html`)];
  for (const route of routes) assert.equal((await stat(path.join(root, 'dist', route))).isFile(), true, route);
});

test('product slugs and references are unique', () => {
  assert.equal(new Set(products.map((product) => product.slug)).size, products.length);
  assert.equal(new Set(products.map((product) => product.reference)).size, products.length);
});

test('catalogue links to each product and quote flow', async () => {
  const catalogue = await readFile(path.join(root, 'dist/products/index.html'), 'utf8');
  for (const product of products) assert.match(catalogue, new RegExp(`href="${product.slug}/"`));
  const productPage = await readFile(path.join(root, `dist/products/${products[0].slug}/index.html`), 'utf8');
  assert.match(productPage, /href="\.\.\/\.\.\/quote\/\?product=/);
});

test('all generated internal href targets resolve', async () => {
  const pages = ['index.html', 'products/index.html', 'quote/index.html', ...products.map((product) => `products/${product.slug}/index.html`)];
  for (const page of pages) {
    const html = await readFile(path.join(root, 'dist', page), 'utf8');
    const hrefs = [...html.matchAll(/href="([^"#?]+)(?:[?#][^"]*)?"/g)].map((match) => match[1]);
    for (const href of hrefs) {
      if (/^(?:https?:|mailto:)/.test(href)) continue;
      const resolved = path.resolve(path.dirname(path.join(root, 'dist', page)), href);
      const candidate = href.endsWith('/') ? path.join(resolved, 'index.html') : resolved;
      assert.equal((await stat(candidate).catch(() => null))?.isFile(), true, `${page}: ${href}`);
    }
  }
});
