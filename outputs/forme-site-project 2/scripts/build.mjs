import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'src');
const dist = path.join(root, 'dist');
const site = JSON.parse(await readFile(path.join(src, 'data/site.json'), 'utf8'));
const products = JSON.parse(await readFile(path.join(src, 'data/products.json'), 'utf8'));

const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
}[character]));

const categories = [...new Map(products.map((product) => [product.categorySlug, product.category])).entries()]
  .map(([slug, name]) => ({ slug, name, count: products.filter((product) => product.categorySlug === slug).length }));

function paths(depth = 0) {
  const base = depth === 0 ? './' : '../'.repeat(depth);
  return {
    home: base,
    products: `${base}products/`,
    quote: `${base}quote/`,
    assets: `${base}assets/`
  };
}

function bagSvg(shape = 'tote') {
  const shapes = {
    tote: '<path d="M40 40h120l15 130H25L40 40Z"/><path d="M70 54V35c0-28 60-28 60 0v19"/>',
    'tote-wide': '<path d="M24 65h152l-12 105H36L24 65Z"/><path d="M62 72V48c0-26 76-26 76 0v24"/>',
    shoulder: '<rect x="35" y="65" width="130" height="95" rx="16"/><path d="M55 70c8-58 83-58 92 0"/>',
    crescent: '<path d="M25 75c45 25 105 25 150 0-8 75-28 95-75 95S33 150 25 75Z"/><path d="M45 93c10-62 100-62 110 0"/>',
    crossbody: '<rect x="52" y="48" width="96" height="120" rx="8"/><path d="M66 48 135 8M134 48 65 8"/><path d="m52 80 48 28 48-28"/>',
    'crossbody-wide': '<rect x="35" y="65" width="130" height="95" rx="8"/><path d="M45 65 145 15"/><path d="m35 82 65 35 65-35"/>',
    bucket: '<path d="M55 55h90l10 115H45L55 55Z"/><path d="M65 72c24 13 46 13 70 0M75 56c0-42 50-42 50 0"/>',
    wallet: '<rect x="35" y="58" width="130" height="85" rx="7"/><path d="M100 58v85M116 80h30"/>',
    'wallet-wide': '<rect x="27" y="68" width="146" height="70" rx="7"/><path d="M45 68v-12h110M128 102h25"/>',
    pouch: '<path d="M32 75h136l-12 85H44L32 75Z"/><path d="M38 75h124M140 75v-12"/>'
  };
  return `<svg viewBox="0 0 200 200" aria-hidden="true" fill="rgba(250,248,242,.72)" stroke="#292a25" stroke-width="1.5" stroke-linejoin="round">${shapes[shape] || shapes.tote}</svg>`;
}

function visual(product, extra = '') {
  return `<div class="bag-visual bg-${escapeHtml(product.color)} ${extra}">${bagSvg(product.shape)}</div>`;
}

function header(page, p) {
  return `<a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <a class="brand" href="${p.home}" aria-label="FORME home">FORME</a>
    <nav class="desktop-nav" aria-label="Main navigation">
      <a href="${p.products}"${page === 'products' ? ' aria-current="page"' : ''}>Products</a>
      <a href="${p.home}#capabilities">Capabilities</a>
      <a href="${p.home}#approach">Approach</a>
    </nav>
    <a class="header-quote" href="${p.quote}"${page === 'quote' ? ' aria-current="page"' : ''}>Request a quote</a>
    <button class="menu-button" type="button" aria-label="Toggle navigation" aria-expanded="false">☰</button>
  </header>`;
}

function footer(p) {
  return `<footer class="site-footer">
    <a class="footer-brand" href="${p.home}">FORME</a>
    <nav class="footer-links" aria-label="Footer navigation">
      <a href="${p.products}">Products</a><a href="${p.home}#capabilities">Capabilities</a><a href="${p.quote}">Request a quote</a>
    </nav>
    <div class="footer-meta"><span>${escapeHtml(site.location)}</span><span>© ${new Date().getFullYear()} FORME</span></div>
  </footer>`;
}

function layout({ title, description, page, depth, content }) {
  const p = paths(depth);
  return `<!doctype html>
<html lang="en"><head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} · ${escapeHtml(site.name)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="theme-color" content="#f3f0e8">
  <link rel="stylesheet" href="${p.assets}styles.css">
  <script src="${p.assets}site.js" defer></script>
</head><body>${header(page, p)}<main id="main">${content}</main>${footer(p)}</body></html>`;
}

function homePage() {
  const p = paths(0);
  const lead = products[0];
  const categoryCards = categories.map((category, index) => `<a class="category-card" href="${p.products}?category=${category.slug}">
    <span>0${index + 1} / ${category.count} styles</span><h3>${escapeHtml(category.name)}</h3><span class="arrow" aria-hidden="true">↗</span>
  </a>`).join('');
  const content = `<section class="hero">
    <div class="hero-copy"><span class="eyebrow">Private-label development & manufacturing</span><h1>Made for your next collection.</h1>
      <p>We help independent brands develop considered leather goods—from first prototype to repeat production.</p>
      <div class="hero-actions"><a class="button" href="${p.products}">Explore products</a><a class="text-link" href="${p.quote}">Start a project →</a></div>
    </div>
    <div class="hero-art">${visual(lead)}<span class="hero-note">Form study / ${lead.reference}</span></div>
  </section>
  <section class="section" id="approach"><div class="section-heading"><div><span class="eyebrow">Product library</span><h2>Start with a form.</h2></div><a class="text-link" href="${p.products}">View all products →</a></div><div class="categories">${categoryCards}</div></section>
  <section class="section capabilities" id="capabilities"><div><span class="eyebrow">Our capabilities</span><h2>From material to finished piece.</h2></div>
    <div class="capability-list">
      <div class="capability-item"><span>01</span><div><strong>Product development</strong><p>Pattern development, sampling and construction refinement built around your brief.</p></div></div>
      <div class="capability-item"><span>02</span><div><strong>Material sourcing</strong><p>Leather, alternative materials, linings and trims aligned with your positioning.</p></div></div>
      <div class="capability-item"><span>03</span><div><strong>Custom hardware</strong><p>Finish selection, branded components and custom hardware development.</p></div></div>
      <div class="capability-item"><span>04</span><div><strong>Production</strong><p>Quality-managed small and scaled production runs with clear project communication.</p></div></div>
    </div>
  </section>`;
  return layout({ title: 'Leather goods manufacturing', description: site.description, page: 'home', depth: 0, content });
}

function productsPage() {
  const p = paths(1);
  const filters = [{ slug: 'all', name: 'All' }, ...categories].map((category) => `<button class="filter-button" type="button" data-filter="${category.slug}" aria-pressed="false">${escapeHtml(category.name)}</button>`).join('');
  const cards = products.map((product) => `<article class="product-card" data-category="${product.categorySlug}">
    <a href="${product.slug}/" aria-label="View ${escapeHtml(product.name)}"> <div class="product-image">${visual(product)}</div>
      <div class="product-title-row"><h2>${escapeHtml(product.name)}</h2><span class="product-ref">${escapeHtml(product.reference)}</span></div>
      <p>${escapeHtml(product.summary)}</p>
    </a>
  </article>`).join('');
  const content = `<header class="page-intro"><span class="eyebrow">Product library</span><h1>Shapes to build from.</h1><p>Reference styles for private-label development. Every proportion, material, component and finish can be adapted to your collection.</p></header>
  <div class="catalogue-controls"><div class="filters" aria-label="Filter products">${filters}</div><span class="catalogue-count" data-product-count>${products.length} styles</span></div>
  <section class="product-grid" aria-label="Product catalogue">${cards}</section>`;
  return layout({ title: 'Products', description: 'Explore FORME reference styles for custom leather goods development.', page: 'products', depth: 1, content });
}

function productPage(product) {
  const p = paths(2);
  const content = `<article class="product-detail"><div class="product-detail-media">${visual(product, 'product-detail-media')}</div>
    <div class="product-detail-copy"><span class="product-ref">${escapeHtml(product.category)} / ${escapeHtml(product.reference)}</span><h1>${escapeHtml(product.name)}</h1><p class="product-summary">${escapeHtml(product.summary)}</p>
      <dl class="specs"><div><dt>Dimensions</dt><dd>${escapeHtml(product.dimensions)}</dd></div><div><dt>Construction</dt><dd>${escapeHtml(product.construction)}</dd></div><div><dt>Materials</dt><dd>${escapeHtml(product.materials)}</dd></div><div><dt>Hardware</dt><dd>${escapeHtml(product.hardware)}</dd></div></dl>
      <a class="button" href="${p.quote}?product=${encodeURIComponent(product.slug)}">Request this style</a>
    </div></article>`;
  return layout({ title: product.name, description: product.summary, page: 'product', depth: 2, content });
}

function quotePage() {
  const options = products.map((product) => `<option value="${product.slug}">${escapeHtml(product.name)} — ${escapeHtml(product.reference)}</option>`).join('');
  const content = `<section class="quote-layout"><header class="quote-intro"><span class="eyebrow">New project</span><h1>Tell us what you’re making.</h1></header>
    <div class="quote-panel"><form class="quote-form" data-quote-form data-recipient="${escapeHtml(site.quoteRecipient)}">
      <div class="field"><label for="name">Your name *</label><input id="name" name="name" autocomplete="name" required></div>
      <div class="field"><label for="company">Company / brand *</label><input id="company" name="company" autocomplete="organization" required></div>
      <div class="field full"><label for="email">Email *</label><input id="email" name="email" type="email" autocomplete="email" required></div>
      <div class="field full"><label for="product">Reference style</label><select id="product" name="product"><option value="general">General / new development</option>${options}</select></div>
      <div class="field"><label for="quantity">Estimated quantity</label><input id="quantity" name="quantity" inputmode="numeric" placeholder="e.g. 300 units"></div>
      <div class="field"><label for="delivery">Target delivery</label><input id="delivery" name="delivery" placeholder="e.g. September 2027"></div>
      <div class="field full"><label for="brief">Project brief *</label><textarea id="brief" name="brief" required placeholder="Tell us about the product, materials, target price and customization you have in mind."></textarea></div>
      <p class="form-note">Submitting prepares an email in your default mail app. No project information is stored on this website.</p>
      <button class="button" type="submit">Prepare enquiry</button><p class="form-status" role="status" aria-live="polite"></p>
    </form></div></section>`;
  return layout({ title: 'Request a quote', description: 'Start a private-label leather goods development project with FORME.', page: 'quote', depth: 1, content });
}

async function output(relativePath, html) {
  const target = path.join(dist, relativePath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, html);
}

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(path.join(src, 'assets'), path.join(dist, 'assets'), { recursive: true });
await output('index.html', homePage());
await output('products/index.html', productsPage());
await output('quote/index.html', quotePage());
for (const product of products) await output(`products/${product.slug}/index.html`, productPage(product));
await output('404.html', layout({ title: 'Page not found', description: 'The requested page could not be found.', page: '404', depth: 0, content: '<section class="not-found"><div><span class="eyebrow">Page not found</span><h1>404</h1><p><a class="button" href="./">Return home</a></p></div></section>' }));
await writeFile(path.join(dist, '.nojekyll'), '');
console.log(`Built ${products.length + 4} pages in dist/`);
