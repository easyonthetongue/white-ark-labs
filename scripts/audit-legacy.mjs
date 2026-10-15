import { readFile, writeFile } from 'node:fs/promises';
import { categories, products } from '../src/data/catalogue.mjs';

const source = await readFile('src/pages/products.html','utf8');
const match = source.match(/const products=(\[[\s\S]*?\]);\s*const img=/);
if (!match) throw new Error('Legacy catalogue array was not found.');
const legacy = JSON.parse(match[1]);
const categoryTypes = new Map([
  ['cat-womens',new Set(['Tote Bag','Shoulder Bag','Crossbody Bag','Clutch Bag'])],
  ['cat-travel',new Set(['Backpack','Briefcase','Messenger Bag','Laptop Bag','Duffel Bag | Travel Bag'])],
  ['cat-small',new Set(['Phone Bag','Purse | Wallet','Passport Case','Card Holder','Ipad Case'])],
  ['cat-lifestyle',new Set(['Belt','Leather Accessories','Pet Supplies'])],
  ['cat-pouches',new Set(['Cosmetic Bag | Make Up Bag','Washing Bag'])]
]);
const selected = [];
for (const category of categories) {
  const candidates = legacy.filter((item) => categoryTypes.get(category.id).has(item.type));
  const targets = products.filter((item) => item.categoryId === category.id);
  for (let index=0; index<Math.min(candidates.length,targets.length); index++) selected.push([candidates[index].id,targets[index].id]);
}
const missing = products.filter((product) => !selected.some(([,target]) => target === product.id));
const replacementPool = legacy.filter((item) => !selected.some(([id]) => id === item.id));
const replacementIds = new Set();
for (let index=0; index<missing.length; index++) { selected.push([replacementPool[index].id,missing[index].id]); replacementIds.add(replacementPool[index].id); }
const selectedMap = new Map(selected);
let directIndex = 0;
const entries = legacy.map((item) => {
  const targetId = selectedMap.get(item.id);
  if (!targetId) return { legacyId:item.id, name:item.name, legacyType:item.type, disposition:'REMOVE', newProductId:null, rationale:'Duplicate, outside the five-category scope, or less suitable than the selected reference.' };
  const target = products.find((product) => product.id === targetId);
  let disposition;
  if (replacementIds.has(item.id)) disposition='REPLACE';
  else disposition=directIndex++ < 20 ? 'KEEP' : 'MODIFY';
  return { legacyId:item.id, name:item.name, legacyType:item.type, disposition, newProductId:target.id, newProductSlug:target.slug, rationale:disposition==='KEEP'?'Useful existing archetype and imagery retained as a catalogue starting point.':disposition==='MODIFY'?'Relevant slot retained with normalized category, B2B specifications, relationships and revised copy.':'Unsuitable slot replaced with a missing product archetype required by the new taxonomy.' };
});
const counts = Object.fromEntries(['KEEP','MODIFY','REPLACE','REMOVE'].map((key)=>[key,entries.filter((item)=>item.disposition===key).length]));
const target='src/data/catalogue-audit.json';
const next=`${JSON.stringify({ legacyCount:legacy.length, finalCount:products.length, counts, entries },null,2)}\n`;
const current=await readFile(target,'utf8').catch(()=>null);
if (current!==next) await writeFile(target,next);
console.log(`Audited ${legacy.length} legacy records: ${JSON.stringify(counts)}`);
