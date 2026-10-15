import { categories, constructionCapabilities, materials, products, techniques } from '../src/data/catalogue.mjs';

const issues = [];
const unique = (items, key, label) => {
  const values = items.map((item) => item[key]);
  if (new Set(values).size !== values.length) issues.push(`${label} ${key} values must be unique`);
  if (values.some((value) => !value)) issues.push(`${label} ${key} values must be present`);
};
const requireFields = (items, fields, label) => items.forEach((item) => fields.forEach((field) => {
  if (item[field] === undefined || item[field] === '') issues.push(`${label} ${item.id || item.slug}: missing ${field}`);
}));

if (categories.length !== 5) issues.push(`Expected 5 categories, received ${categories.length}`);
if (products.filter((item) => item.status === 'published').length < 46) issues.push('Expected at least 46 published products');
unique(categories, 'id', 'Category'); unique(categories, 'slug', 'Category');
unique(products, 'id', 'Product'); unique(products, 'slug', 'Product');
unique(materials, 'id', 'Material'); unique(materials, 'slug', 'Material');
unique(techniques, 'id', 'Technique'); unique(techniques, 'slug', 'Technique');
unique(constructionCapabilities, 'id', 'Capability'); unique(constructionCapabilities, 'slug', 'Capability');

requireFields(products, ['name','categoryId','subcategory','shortDescription','fullDescription','featuredImage','galleryImages','materialIds','availableColors','dimensions','dimensionsUnit','constructionType','liningOptions','hardwareOptions','closureType','customizationOptions','techniqueIds','productionNotes','sampleAvailability','minimumOrderQuantity','estimatedLeadTime','featured','status','sortOrder','seoTitle','seoDescription'], 'Product');
requireFields(materials, ['name','family','description','characteristics','typicalApplications','finishOptions','image','compatibleProductIds','sourcingStatus','seoTitle','seoDescription'], 'Material');
requireFields(techniques, ['name','description','typicalApplications','compatibleProductIds','compatibleMaterialIds','image','productionConsiderations','availabilityStatus'], 'Technique');

const categoryIds = new Set(categories.map((item) => item.id));
const materialIds = new Set(materials.map((item) => item.id));
const techniqueIds = new Set(techniques.map((item) => item.id));
const productIds = new Set(products.map((item) => item.id));
for (const product of products) {
  if (!categoryIds.has(product.categoryId)) issues.push(`${product.id}: invalid category ${product.categoryId}`);
  for (const id of product.materialIds) if (!materialIds.has(id)) issues.push(`${product.id}: invalid material ${id}`);
  for (const id of product.techniqueIds) if (!techniqueIds.has(id)) issues.push(`${product.id}: invalid technique ${id}`);
  if (!Array.isArray(product.galleryImages) || product.galleryImages.length < 1) issues.push(`${product.id}: gallery required`);
}
for (const material of materials) for (const id of material.compatibleProductIds) if (!productIds.has(id)) issues.push(`${material.id}: invalid product ${id}`);
for (const technique of techniques) {
  for (const id of technique.compatibleProductIds) if (!productIds.has(id)) issues.push(`${technique.id}: invalid product ${id}`);
  for (const id of technique.compatibleMaterialIds) if (!materialIds.has(id)) issues.push(`${technique.id}: invalid material ${id}`);
}

const expectedCounts = new Map([['cat-womens',12],['cat-travel',8],['cat-small',10],['cat-lifestyle',8],['cat-pouches',8]]);
for (const [id, expected] of expectedCounts) {
  const actual = products.filter((product) => product.categoryId === id).length;
  if (actual < expected) issues.push(`${id}: expected at least ${expected}, received ${actual}`);
}

if (issues.length) {
  console.error(issues.map((issue) => `- ${issue}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Validated ${products.length} products, ${categories.length} categories, ${materials.length} materials and ${techniques.length} techniques.`);
}
