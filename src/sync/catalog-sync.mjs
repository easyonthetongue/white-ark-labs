import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, readdir, copyFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { categories, materials, techniques } from '../data/catalogue.mjs';
import { parseDescription } from './description-parser.mjs';

const root = path.resolve('.');
const sourceRoot = path.join(root, 'catalog', 'products');
const statePath = path.join(root, 'src/data/catalogue-sync-state.json');
const outputPath = path.join(root, 'src/data/imported-products.mjs');
const mediaRoot = path.join(root, 'src/assets/catalogue');
const lockPath = path.join(root, '.catalog-sync.lock');
const expected = ['01-front.jpg', '02-three-quarter.jpg', '03-side.jpg', '04-detail.jpg', 'product-description.txt'];
const slugify = (value) => String(value).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
async function stateRead() { try { return JSON.parse(await readFile(statePath, 'utf8')); } catch { return { products: {}, lastSync: null }; } }
function categoryFor(value) { const key = slugify(value); const aliases = { 'handbags-totes': 'womens-handbags', totes: 'womens-handbags', handbags: 'womens-handbags' }; const resolved = aliases[key] || key; return categories.find((item) => item.slug === resolved || slugify(item.name) === resolved); }
function resolveIds(values = [], records) { return values.map((value) => records.find((item) => slugify(item.name).includes(slugify(value)) || slugify(value).includes(slugify(item.name)))?.id).filter(Boolean); }
async function lock() { try { await mkdir(lockPath); } catch (error) { if (error.code === 'EEXIST') throw new Error('Another catalogue synchronization is already running.'); throw error; } }

export async function syncCatalog({ dryRun = false, sku = null, force = false } = {}) {
  const started = Date.now(); const report = { status: 'running', discovered: 0, added: 0, updated: 0, unchanged: 0, failed: [], imagesProcessed: 0, warnings: [], durationMs: 0 };
  await lock();
  try {
    const state = await stateRead(); const entries = await readdir(sourceRoot, { withFileTypes: true }).catch(() => []); const folders = entries.filter((item) => item.isDirectory() && (!sku || item.name.toUpperCase() === sku.toUpperCase()));
    report.discovered = folders.length; const imported = new Map(Object.entries(state.products || {}).map(([key, value]) => [key, value.product]));
    for (const folder of folders) {
      try {
        const folderPath = path.join(sourceRoot, folder.name); const names = new Set(await readdir(folderPath)); const missing = expected.filter((name) => !names.has(name)); if (missing.length) throw new Error(`Missing required file(s): ${missing.join(', ')}`);
        const description = await readFile(path.join(folderPath, 'product-description.txt'), 'utf8'); const parsed = parseDescription(description, `${folder.name}/product-description.txt`); if (parsed.errors.length) throw new Error(parsed.errors.join('; '));
        const productSku = parsed.data.sku.toUpperCase(); if (productSku !== folder.name.toUpperCase()) report.warnings.push(`${folder.name}: folder name and SKU differ`); const category = categoryFor(parsed.data.category); if (!category) throw new Error(`Unknown category: ${parsed.data.category}`);
        const images = []; for (const filename of expected.slice(0, 4)) { const bytes = await readFile(path.join(folderPath, filename)); if (bytes.length < 100) throw new Error(`${filename} appears empty or invalid`); images.push({ filename, bytes }); }
        const fingerprint = hash(Buffer.concat([Buffer.from(description), ...images.map((item) => item.bytes)])); const existing = state.products[productSku]; if (existing && existing.fingerprint === fingerprint && !force) { report.unchanged++; imported.set(productSku, existing.product); continue; }
        const slug = slugify(parsed.data.name); const imageUrls = images.map(({ filename }) => `/assets/catalogue/${slug}/${filename}`);
        if (!dryRun) { const destination = path.join(mediaRoot, slug); await mkdir(destination, { recursive: true }); for (const image of images) { await copyFile(path.join(folderPath, image.filename), path.join(destination, image.filename)); report.imagesProcessed++; } }
        const product = { id: `WAL-${productSku}`, slug, name: parsed.data.name, categoryId: category.id, subcategory: parsed.data.subcategory || category.name, shortDescription: parsed.data.shortDescription || parsed.data.fullDescription, fullDescription: parsed.data.fullDescription || parsed.data.shortDescription, featuredImage: imageUrls[0], galleryImages: imageUrls, materialIds: resolveIds(parsed.data.materials, materials), availableColors: parsed.data.availableColors || ['Custom colour subject to material availability'], dimensions: parsed.data.dimensions || 'Confirmed on quotation', dimensionsUnit: 'cm', constructionType: parsed.data.constructionType || 'Confirmed on quotation', liningOptions: parsed.data.liningOptions || ['Confirmed on quotation'], hardwareOptions: parsed.data.hardwareOptions || ['Confirmed on quotation'], closureType: parsed.data.closureType || 'Selected during development', customizationOptions: parsed.data.customizationOptions || ['Dimensions', 'Material and colour', 'Branding'], techniqueIds: resolveIds(parsed.data.techniques, techniques), productionNotes: 'Final construction, tolerances, partner suitability and production schedule are confirmed after sample approval.', sampleAvailability: parsed.data.sampleAvailability || 'Available for development', minimumOrderQuantity: parsed.data.minimumOrderQuantity || null, estimatedLeadTime: parsed.data.estimatedLeadTime || null, featured: false, status: 'published', sortOrder: 1000 + imported.size, seoTitle: `${parsed.data.name} | White Ark Labs`, seoDescription: parsed.data.shortDescription || parsed.data.fullDescription, source: { provider: 'repository', folder: `catalog/products/${folder.name}`, fingerprint, syncedAt: new Date().toISOString() } };
        imported.set(productSku, product); state.products[productSku] = { fingerprint, product }; existing ? report.updated++ : report.added++;
      } catch (error) { report.failed.push({ folder: folder.name, error: error.message }); }
    }
    if (!dryRun) { await writeFile(outputPath, `// Generated by products:sync — do not edit manually.\nexport const importedProducts = ${JSON.stringify([...imported.values()], null, 2)};\n`); state.lastSync = new Date().toISOString(); await writeFile(statePath, `${JSON.stringify(state, null, 2)}\n`); }
    report.status = report.failed.length ? 'completed-with-errors' : 'completed'; report.durationMs = Date.now() - started; return report;
  } finally { await rm(lockPath, { recursive: true, force: true }); }
}
