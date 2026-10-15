import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { categories, materials, products, techniques } from '../src/data/catalogue.mjs';
import { filterCatalogue, searchFromState, sortCatalogue, stateFromSearch } from '../src/assets/catalogue-query.mjs';
import { submitQuote } from '../src/assets/quote-adapter.mjs';

const root = path.resolve('.');
const dist = path.join(root,'dist');
execFileSync(process.execPath,['scripts/validate-data.mjs'],{cwd:root});
execFileSync(process.execPath,['scripts/build.mjs'],{cwd:root});

const canonicalRoutes = ['', 'products', ...categories.map((x)=>`products/${x.slug}`), ...products.map((x)=>`products/${x.slug}`), 'materials', ...materials.map((x)=>`materials/${x.slug}`), 'craftsmanship', ...techniques.map((x)=>`craftsmanship/${x.slug}`), 'capabilities/construction-finishing', 'our-process', 'about', 'get-a-quote'];
const routeFile = (route) => path.join(dist,route,'index.html');

test('catalogue has the requested counts and unique stable identities', () => {
  assert.equal(categories.length,5); assert.ok(products.length >= 46); assert.equal(materials.length,6); assert.equal(techniques.length,12);
  assert.ok(categories.every((category) => products.filter((product)=>product.categoryId===category.id).length > 0));
  for (const key of ['id','slug']) assert.equal(new Set(products.map((item)=>item[key])).size,products.length);
});

test('all 89 legacy catalogue records have an explicit audit disposition', async () => {
  const audit=JSON.parse(await readFile(path.join(root,'src/data/catalogue-audit.json'),'utf8'));
  assert.equal(audit.entries.length,89); assert.equal(audit.entries.filter((item)=>item.disposition!=='REMOVE').length,products.length);
});

test('all catalogue relationships resolve in both directions', () => {
  const categoryIds=new Set(categories.map((x)=>x.id)),materialIds=new Set(materials.map((x)=>x.id)),techniqueIds=new Set(techniques.map((x)=>x.id)),productIds=new Set(products.map((x)=>x.id));
  for (const product of products) { assert(categoryIds.has(product.categoryId)); product.materialIds.forEach((id)=>assert(materialIds.has(id),`${product.id} material ${id}`)); product.techniqueIds.forEach((id)=>assert(techniqueIds.has(id),`${product.id} technique ${id}`)); }
  materials.forEach((item)=>item.compatibleProductIds.forEach((id)=>assert(productIds.has(id))));
  techniques.forEach((item)=>item.compatibleProductIds.forEach((id)=>assert(productIds.has(id))));
});

test('every canonical route builds and invalid routes have a proper 404 document', async () => {
  for (const route of canonicalRoutes) assert.equal((await stat(routeFile(route))).isFile(),true,route||'/');
  const missing=await readFile(path.join(dist,'404.html'),'utf8'); assert.match(missing,/<h1>404<\/h1>/); assert.match(missing,/noindex/);
});

test('all generated internal links and breadcrumbs resolve', async () => {
  const visit = async (directory) => (await readdir(directory,{withFileTypes:true})).flatMap((entry)=>entry.isDirectory()?[]:[path.join(directory,entry.name)]);
  const stack=[dist],files=[]; while(stack.length){const dir=stack.pop();for(const entry of await readdir(dir,{withFileTypes:true})){const full=path.join(dir,entry.name);entry.isDirectory()?stack.push(full):files.push(full);}}
  for (const file of files.filter((item)=>item.endsWith('.html'))) {
    const html=await readFile(file,'utf8');
    if (!file.endsWith('404.html') && !html.includes('Redirecting')) assert.match(html,/class="breadcrumbs"|<section class="hero">/);
    for (const match of html.matchAll(/href="([^"#?]+)(?:[?#][^"]*)?"/g)) {
      const href=match[1]; if (/^(?:https?:|mailto:)/.test(href)) continue;
      const resolved=path.resolve(path.dirname(file),href),candidate=href.endsWith('/')?path.join(resolved,'index.html'):resolved;
      assert.equal((await stat(candidate).catch(()=>null))?.isFile(),true,`${path.relative(dist,file)} -> ${href}`);
    }
  }
});

test('navigation contains every required real destination and accessible dropdown controls', async () => {
  const html=await readFile(routeFile(''),'utf8');
  for (const label of ['Products','Materials','Craftsmanship','Our Process','About','Get a Quote']) assert.match(html,new RegExp(`>${label.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}<`));
  assert.equal((html.match(/class="nav-toggle"/g)||[]).length,3); assert.match(html,/aria-expanded="false"/);
  const js=await readFile(path.join(root,'src/assets/site.js'),'utf8'); assert.match(js,/ArrowDown/); assert.match(js,/Escape/); assert.match(js,/mobile-toggle/);
});

test('homepage shows exactly five categories and no selected references section', async () => {
  const html=await readFile(routeFile(''),'utf8');
  const categorySection=html.match(/<div class="category-grid">([\s\S]*?)<\/div><\/section>/)?.[1]||'';
  const selected=html.match(/<section class="section selected">([\s\S]*?)<\/section>/)?.[1]||'';
  assert.equal((categorySection.match(/class="category-card"/g)||[]).length,5);
  assert.equal(selected, '');
  assert.ok(!html.includes('Selected references'));
});

test('search, individual filters, combined filters, sort and URL state are deterministic', () => {
  const items=products.map((p)=>({name:p.name,category:categories.find((c)=>c.id===p.categoryId).slug,materials:p.materialIds,techniques:p.techniqueIds,search:[p.name,p.subcategory,...p.materialIds,...p.techniqueIds].join(' ').toLowerCase(),sortOrder:p.sortOrder}));
  assert(filterCatalogue(items,{q:'tote',category:'',material:'',technique:''}).length>=2);
  assert.equal(filterCatalogue(items,{q:'',category:'womens-handbags',material:'',technique:''}).length,13);
  assert(filterCatalogue(items,{q:'',category:'',material:'mat-textile',technique:''}).length>0);
  assert(filterCatalogue(items,{q:'',category:'',material:'',technique:'tech-weaving'}).length>0);
  const combined=filterCatalogue(items,{q:'belt',category:'belts-lifestyle-accessories',material:'mat-cowhide',technique:'tech-weaving'}); assert.equal(combined.length,1);
  assert.equal(sortCatalogue(items,'name')[0].name,'Arc Shoulder Bag');
  const state={q:'tote',category:'womens-handbags',material:'mat-cowhide',technique:'tech-embossing',sort:'name'}; assert.deepEqual(stateFromSearch(`?${searchFromState(state)}`),state);
});

test('product pages have galleries, relational content and quote preselection', async () => {
  for (const product of products) {
    const html=await readFile(routeFile(`products/${product.slug}`),'utf8');
    assert.match(html,/data-gallery/); assert.match(html,new RegExp(`get-a-quote/\\?product=${product.slug}`));
    for (const id of product.materialIds) assert.match(html,new RegExp(`materials/${materials.find((m)=>m.id===id).slug}/`));
    for (const id of product.techniqueIds) assert.match(html,new RegExp(`craftsmanship/${techniques.find((t)=>t.id===id).slug}/`));
    assert.doesNotMatch(html,/Add to Cart|Buy Now|checkout|customer review|\$\d/iu);
  }
});

test('quote form is safe, validated and never claims success without a handler response', async () => {
  const html=await readFile(routeFile('get-a-quote'),'utf8'),js=await readFile(path.join(root,'src/assets/site.js'),'utf8');
  for (const name of ['name','email','company','country','product','quantity','material','details','reference']) assert.match(html,new RegExp(`name="${name}"`));
  assert.match(html,/type="file"/); assert.match(js,/8 \* 1024 \* 1024/); assert.match(js,/if \(!endpoint\)/); assert.match(js,/submitQuote\(endpoint/);
  assert.doesNotMatch(html,/request was delivered/);
});

test('configured quote adapter accepts success and rejects handler errors', async () => {
  const form=new FormData(); form.set('email','buyer@example.com');
  let request;
  await submitQuote('https://quotes.example/submit',form,async (url,options)=>{request={url,options};return {ok:true};});
  assert.equal(request.url,'https://quotes.example/submit'); assert.equal(request.options.method,'POST'); assert.equal(request.options.body,form);
  await assert.rejects(()=>submitQuote('',form,async()=>({ok:true})),/not configured/);
  await assert.rejects(()=>submitQuote('https://quotes.example/submit',form,async()=>({ok:false})),/rejected/);
});

test('SEO files list canonical published routes only', async () => {
  const sitemap=await readFile(path.join(dist,'sitemap.xml'),'utf8'),robots=await readFile(path.join(dist,'robots.txt'),'utf8');
  assert.equal((sitemap.match(/<url>/g)||[]).length,canonicalRoutes.length); assert.doesNotMatch(sitemap,/products\.html|\/quote\//); assert.match(robots,/Sitemap:/);
  for (const route of canonicalRoutes) { const html=await readFile(routeFile(route),'utf8'); assert.match(html,/<link rel="canonical"/); assert.match(html,/<meta property="og:title"/); assert.match(html,/application\/ld\+json/); }
});

test('responsive layouts, gallery behavior, empty state and image fallbacks are present', async () => {
  const css=await readFile(path.join(root,'src/assets/styles.css'),'utf8'),js=await readFile(path.join(root,'src/assets/site.js'),'utf8');
  assert.match(css,/@media\(max-width:1050px\)/); assert.match(css,/@media\(max-width:500px\)/); assert.match(js,/data-gallery-src/); assert.match(js,/Image unavailable/); assert.match(js,/data-empty-state/); assert.match(js,/popstate/);
});
