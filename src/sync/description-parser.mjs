const fields = {
  sku: 'sku', name: 'name', category: 'category', subcategory: 'subcategory',
  description: 'fullDescription', shortdescription: 'shortDescription',
  materials: 'materials', material: 'materials', dimensions: 'dimensions',
  construction: 'constructionType', constructiontype: 'constructionType',
  colors: 'availableColors', availablecolors: 'availableColors',
  techniques: 'techniques', techniques: 'techniques',
  lining: 'liningOptions', hardware: 'hardwareOptions', closure: 'closureType',
  customization: 'customizationOptions', moq: 'minimumOrderQuantity',
  leadtime: 'estimatedLeadTime', sampleavailability: 'sampleAvailability'
};

export function parseDescription(text, source = 'product-description.txt') {
  const result = { sourceFile: source };
  const errors = [];
  const lines = String(text || '').split(/\r?\n/);
  for (const [index, raw] of lines.entries()) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const match = line.match(/^([^:]+):\s*(.+)$/);
    if (!match) continue;
    const key = fields[match[1].trim().toLowerCase().replace(/[ _-]/g, '')];
    if (!key) continue;
    const value = match[2].trim();
    result[key] = ['materials','availableColors','techniques','liningOptions','hardwareOptions','customizationOptions'].includes(key)
      ? value.split(/\s*[|,]\s*/).filter(Boolean) : value;
  }
  // Also accept the compact human-readable catalogue format used in dropped ZIPs:
  // `Category / SKU`, a `# Product name` heading, then labelled paragraphs.
  const header = lines.map((line) => line.trim()).find((line) => /\/\s*[A-Z]{2,}-\d+/i.test(line));
  const headerMatch = header?.match(/^(.+?)\s*\/\s*([A-Z]{2,}-\d+)\s*$/i);
  if (headerMatch) { result.category = result.category || headerMatch[1].trim(); result.sku = result.sku || headerMatch[2].toUpperCase(); }
  const title = lines.find((line) => line.trim().startsWith('#'));
  if (title) result.name = result.name || title.replace(/^#+\s*/, '').trim();
  const labelMap = { 'typical dimensions': 'dimensions', construction: 'constructionType', closure: 'closureType', lining: 'liningOptions', hardware: 'hardwareOptions', material: 'materials', sampling: 'sampleAvailability', moq: 'minimumOrderQuantity', 'lead time': 'estimatedLeadTime' };
  for (let index = 0; index < lines.length; index += 1) {
    const key = labelMap[lines[index].trim().toLowerCase()];
    if (!key) continue;
    const value = lines.slice(index + 1).find((line) => line.trim() && !labelMap[line.trim().toLowerCase()]);
    if (value && !result[key]) result[key] = ['materials','liningOptions','hardwareOptions'].includes(key) ? value.trim().split(/\s*\/\s*|\s*;\s*/).filter(Boolean) : value.trim();
  }
  if (!result.fullDescription) {
    const paragraphs = String(text || '').split(/\n\s*\n/).map((part) => part.trim()).filter((part) => part && !part.startsWith('#') && !/^[A-Za-z &]+\s*\/$/.test(part) && !labelMap[part.toLowerCase()]);
    result.fullDescription = paragraphs.slice(0, 2).join(' ');
    result.shortDescription = paragraphs[0] || result.fullDescription;
  }
  if (!result.sku) errors.push('Missing required field: SKU');
  if (!result.name) errors.push('Missing required field: Name');
  if (!result.category) errors.push('Missing required field: Category');
  if (!result.fullDescription && !result.shortDescription) errors.push('Missing required field: Description');
  return { data: result, errors };
}
