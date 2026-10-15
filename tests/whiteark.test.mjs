import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve('.');
execFileSync(process.execPath, ['scripts/build-whiteark.mjs'], { cwd: root });

test('build creates clean homepage and catalogue routes', async () => {
  for (const route of ['index.html', 'products/index.html', 'products.html', '404.html']) {
    assert.equal((await stat(path.join(root, 'dist', route))).isFile(), true, route);
  }
});

test('homepage preserves the supplied White Ark design and category navigation', async () => {
  const page = await readFile(path.join(root, 'dist/index.html'), 'utf8');
  assert.match(page, /Carry less\.<br>Mean more\./);
  assert.match(page, /class="category-grid"/);
  assert.match(page, /href="products\/\?category=Tote%20Bag"/);
  assert.doesNotMatch(page, /href="products\.html/);
});

test('products navigation exposes the complete catalogue in logical groups', async () => {
  for (const route of ['index.html', 'products/index.html']) {
    const page = await readFile(path.join(root, 'dist', route), 'utf8');
    assert.match(page, /id="productsToggle"[^>]*aria-expanded="false"/);
    assert.match(page, /Everyday bags/);
    assert.match(page, /Work &amp; travel|Work & travel/);
    assert.match(page, /Small leather goods/);
    assert.match(page, /Accessories/);
    assert.match(page, /View all 89 objects/);
    assert.match(page, /Shoulder bags <span>08<\/span>/);
    assert.match(page, /Pet accessories <span>03<\/span>/);
  }
});

test('product photography remains in full colour at rest and on hover', async () => {
  for (const route of ['index.html', 'products/index.html']) {
    const page = await readFile(path.join(root, 'dist', route), 'utf8');
    assert.match(page, /img\{filter:none!important\}/);
    assert.match(page, /\.catalog-photo img\{mix-blend-mode:normal\}/);
  }
});

test('all public pages use the White Ark Labs brand', async () => {
  for (const route of ['index.html', 'products/index.html', '404.html']) {
    const page = await readFile(path.join(root, 'dist', route), 'utf8');
    assert.match(page, /WHITE ARK LABS|White Ark Labs/);
    assert.doesNotMatch(page, /FORME|Forme|forme/);
  }
});

test('catalogue contains all 89 supplied design studies', async () => {
  const page = await readFile(path.join(root, 'dist/products/index.html'), 'utf8');
  const match = page.match(/const products=(\[[\s\S]*?\]);\s*const img=/);
  assert.ok(match, 'embedded product catalogue should be present');
  assert.equal(JSON.parse(match[1]).length, 89);
  assert.match(page, /Explore the product archive\./);
});

test('production output removes the placeholder enquiry address', async () => {
  for (const route of ['index.html', 'products/index.html']) {
    const page = await readFile(path.join(root, 'dist', route), 'utf8');
    assert.doesNotMatch(page, /studio@white-ark-labs\.example/);
  }
});
