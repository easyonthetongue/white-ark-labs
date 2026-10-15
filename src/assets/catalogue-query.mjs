export function filterCatalogue(items, state) {
  const query = (state.q || '').trim().toLowerCase();
  return items.filter((item) => {
    const materials = Array.isArray(item.materials) ? item.materials : String(item.materials || '').split(',');
    const techniques = Array.isArray(item.techniques) ? item.techniques : String(item.techniques || '').split(',');
    return (!query || String(item.search || '').toLowerCase().includes(query)) &&
      (!state.category || item.category === state.category) &&
      (!state.material || materials.includes(state.material)) &&
      (!state.technique || techniques.includes(state.technique));
  });
}

export function sortCatalogue(items, mode = 'sort') {
  const result = [...items];
  if (mode === 'name') result.sort((a,b) => a.name.localeCompare(b.name));
  if (mode === 'category') result.sort((a,b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
  if (mode === 'sort') result.sort((a,b) => a.sortOrder - b.sortOrder);
  return result;
}

export function stateFromSearch(search, aliases = {}) {
  const params = new URLSearchParams(search);
  const category = params.get('category') || '';
  return { q:params.get('q')||'', category:aliases[category]||category, material:params.get('material')||'', technique:params.get('technique')||'', sort:params.get('sort')||'sort' };
}

export function searchFromState(state, scope = '') {
  const params = new URLSearchParams();
  if (state.q) params.set('q',state.q);
  if (!scope && state.category) params.set('category',state.category);
  if (state.material) params.set('material',state.material);
  if (state.technique) params.set('technique',state.technique);
  if (state.sort && state.sort !== 'sort') params.set('sort',state.sort);
  return params.toString();
}
