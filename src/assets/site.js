const adminPanel = document.querySelector('.admin-panel');
if (adminPanel) {
  const runSync = async (dryRun) => {
    const report = adminPanel.querySelector('[data-sync-report]');
    report.textContent = 'Starting…';
    try {
      const response = await fetch('/api/products/sync', { method: 'POST', headers: { 'content-type': 'application/json', 'x-admin-token': adminPanel.querySelector('[data-admin-token]').value }, body: JSON.stringify({ dryRun }) });
      const data = await response.json(); report.textContent = JSON.stringify(data, null, 2);
    } catch (error) { report.textContent = `Sync failed: ${error.message}`; }
  };
  adminPanel.querySelector('[data-sync]')?.addEventListener('click', () => runSync(false));
  adminPanel.querySelector('[data-dry-run]')?.addEventListener('click', () => runSync(true));
}

// Keep the navigation self-contained so it still works in a simple static
// preview server that does not provide JavaScript module MIME handling.
async function submitQuote(endpoint, formData) {
  if (!endpoint) throw new Error('Quote endpoint is not configured.');
  const response = await fetch(endpoint, { method: 'POST', body: formData, headers: { Accept: 'application/json' } });
  if (!response?.ok) throw new Error('The quote handler rejected the request.');
  return response;
}

const header = document.querySelector('.header');
const mobileToggle = document.querySelector('.mobile-toggle');
const navToggles = [...document.querySelectorAll('.nav-toggle')];

function closeMenus(except = null) {
  navToggles.forEach((toggle) => {
    if (toggle === except) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.nextElementSibling?.classList.remove('show');
  });
}

mobileToggle?.addEventListener('click', () => {
  const open = header.classList.toggle('menu-open');
  mobileToggle.setAttribute('aria-expanded', String(open));
  mobileToggle.querySelector('span').textContent = open ? 'Close' : 'Menu';
  if (!open) closeMenus();
});

navToggles.forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    closeMenus(toggle);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.nextElementSibling?.classList.toggle('show', open);
  });
  toggle.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      toggle.setAttribute('aria-expanded', 'true');
      toggle.nextElementSibling?.classList.add('show');
      toggle.nextElementSibling?.querySelector('a')?.focus();
    }
  });
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.has-submenu')) closeMenus();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMenus();
    header?.classList.remove('menu-open');
    mobileToggle?.setAttribute('aria-expanded', 'false');
  }
});

const categoryAliases = {
  'Tote Bag':'womens-handbags','Shoulder Bag':'womens-handbags','Crossbody Bag':'womens-handbags','Clutch Bag':'womens-handbags',
  'Backpack':'travel-business-bags','Briefcase':'travel-business-bags','Messenger Bag':'travel-business-bags','Laptop Bag':'travel-business-bags','Duffel Bag | Travel Bag':'travel-business-bags',
  'Phone Bag':'small-leather-goods','Purse | Wallet':'small-leather-goods','Passport Case':'small-leather-goods','Card Holder':'small-leather-goods','Ipad Case':'small-leather-goods',
  'Belt':'belts-lifestyle-accessories','Leather Accessories':'belts-lifestyle-accessories','Pet Supplies':'belts-lifestyle-accessories',
  'Cosmetic Bag | Make Up Bag':'pouches-organizers','Washing Bag':'pouches-organizers'
};

document.querySelectorAll('[data-catalogue]').forEach((catalogue) => {
  const cards = [...catalogue.querySelectorAll('[data-product-card]')];
  const grid = catalogue.querySelector('[data-product-grid]');
  const search = catalogue.querySelector('[data-search-input]');
  const filters = Object.fromEntries([...catalogue.querySelectorAll('[data-filter]')].map((field) => [field.dataset.filter, field]));
  const sort = catalogue.querySelector('[data-sort]');
  const count = catalogue.querySelector('[data-product-count]');
  const empty = catalogue.querySelector('[data-empty-state]');
  const scope = catalogue.dataset.categoryScope || '';
  const params = new URLSearchParams(location.search);

  const readState = () => ({
    q: search?.value.trim().toLowerCase() || '',
    category: scope || filters.category?.value || '',
    material: filters.material?.value || '',
    technique: filters.technique?.value || '',
    sort: sort?.value || 'sort'
  });

  function render(push = false) {
    const state = readState();
    let visible = cards.filter((card) => {
      const materials = card.dataset.materials.split(',');
      const techniques = card.dataset.techniques.split(',');
      return (!state.q || card.dataset.search.includes(state.q)) && (!state.category || card.dataset.category === state.category) && (!state.material || materials.includes(state.material)) && (!state.technique || techniques.includes(state.technique));
    });
    cards.forEach((card) => { card.hidden = !visible.includes(card); });
    visible.sort((a,b) => state.sort === 'name' ? a.dataset.name.localeCompare(b.dataset.name) : state.sort === 'category' ? a.dataset.category.localeCompare(b.dataset.category) || a.dataset.name.localeCompare(b.dataset.name) : cards.indexOf(a)-cards.indexOf(b));
    visible.forEach((card) => grid.append(card));
    count.textContent = `${visible.length} ${visible.length === 1 ? 'reference design' : 'reference designs'}`;
    empty.hidden = visible.length !== 0;
    const url = new URL(location.href);
    ['q','category','material','technique','sort'].forEach((key) => url.searchParams.delete(key));
    if (state.q) url.searchParams.set('q', state.q);
    if (!scope && state.category) url.searchParams.set('category', state.category);
    if (state.material) url.searchParams.set('material', state.material);
    if (state.technique) url.searchParams.set('technique', state.technique);
    if (state.sort !== 'sort') url.searchParams.set('sort', state.sort);
    history[push ? 'pushState' : 'replaceState']({}, '', url);
  }

  function loadParams() {
    const current = new URLSearchParams(location.search);
    if (search) search.value = current.get('q') || '';
    if (filters.category) filters.category.value = categoryAliases[current.get('category')] || current.get('category') || '';
    if (filters.material) filters.material.value = current.get('material') || '';
    if (filters.technique) filters.technique.value = current.get('technique') || '';
    if (sort) sort.value = current.get('sort') || 'sort';
  }

  loadParams(); render(false);
  let searchTimer;
  search?.addEventListener('input', () => { clearTimeout(searchTimer); searchTimer = setTimeout(() => render(true), 180); });
  Object.values(filters).forEach((field) => field.addEventListener('change', () => render(true)));
  sort?.addEventListener('change', () => render(true));
  catalogue.querySelectorAll('[data-clear-filters]').forEach((button) => button.addEventListener('click', () => {
    if (search) search.value = '';
    Object.values(filters).forEach((field) => { field.value = ''; });
    if (sort) sort.value = 'sort';
    render(true);
  }));
  addEventListener('popstate', () => { loadParams(); render(false); });
});

document.querySelectorAll('[data-gallery]').forEach((gallery) => {
  const main = gallery.querySelector('.gallery-active');
  gallery.querySelectorAll('[data-gallery-src]').forEach((button) => button.addEventListener('click', () => {
    main.src = button.dataset.gallerySrc;
    gallery.querySelectorAll('[data-gallery-src]').forEach((item) => item.removeAttribute('aria-current'));
    button.setAttribute('aria-current', 'true');
  }));
});

const fallbackSvg = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 900"><rect width="100%" height="100%" fill="#e9e7e2"/><text x="50%" y="50%" text-anchor="middle" font-family="Arial" font-size="22" fill="#777">Image unavailable</text></svg>')}`;
document.querySelectorAll('[data-fallback]').forEach((image) => image.addEventListener('error', () => { image.src = fallbackSvg; image.removeAttribute('data-fallback'); }));

const quoteForm = document.querySelector('[data-quote-form]');
if (quoteForm) {
  const params = new URLSearchParams(location.search);
  for (const fieldName of ['product','material']) {
    const field = quoteForm.elements[fieldName];
    const value = params.get(fieldName);
    if (value && [...field.options].some((option) => option.value === value)) field.value = value;
  }
  if (params.get('technique')) quoteForm.elements.details.value = `Technique of interest: ${params.get('technique').replaceAll('-', ' ')}\n`;
  if (params.get('intent') === 'customization') quoteForm.elements.details.value = 'I would like to discuss customization for the selected reference.\n';

  function error(field, message) {
    field.setAttribute('aria-invalid', String(Boolean(message)));
    field.setAttribute('aria-describedby', `${field.id}-error`);
    const target = quoteForm.querySelector(`#${field.id}-error`);
    if (target) target.textContent = message;
  }
  function validate() {
    let valid = true;
    ['name','email','company','country','details'].forEach((name) => {
      const field = quoteForm.elements[name];
      let message = field.value.trim() ? '' : 'This field is required.';
      if (name === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) message = 'Enter a valid business email.';
      error(field, message); if (message) valid = false;
    });
    const file = quoteForm.elements.reference.files[0];
    let fileMessage = '';
    if (file && file.size > 8 * 1024 * 1024) fileMessage = 'The file must be 8 MB or smaller.';
    if (file && !['image/jpeg','image/png','image/webp','application/pdf'].includes(file.type)) fileMessage = 'Use JPG, PNG, WebP or PDF.';
    error(quoteForm.elements.reference, fileMessage); if (fileMessage) valid = false;
    if (quoteForm.elements.website.value) valid = false;
    return valid;
  }
  quoteForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const status = quoteForm.querySelector('.form-status');
    status.className = 'form-status full'; status.textContent = '';
    if (!validate()) { status.classList.add('error-status'); status.textContent = 'Please correct the highlighted fields.'; quoteForm.querySelector('[aria-invalid="true"]')?.focus(); return; }
    const endpoint = quoteForm.dataset.endpoint;
    if (!endpoint) {
      status.classList.add('error-status');
      status.textContent = 'Quote delivery is not configured yet. Add a secure server-side quote endpoint before publishing this form.';
      return;
    }
    const button = quoteForm.querySelector('button[type="submit"]'); button.disabled = true; status.textContent = 'Sending your request…';
    try {
      await submitQuote(endpoint,new FormData(quoteForm));
      status.classList.add('success-status'); status.textContent = 'Your quote request was delivered. We will respond using the business email provided.'; quoteForm.reset();
    } catch (requestError) {
      status.classList.add('error-status'); status.textContent = 'Your request was not delivered. Please try again later or contact White Ark Labs directly.';
    } finally { button.disabled = false; }
  });
}

document.querySelectorAll('.capability-toggle').forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const item = toggle.closest('.capability-item');
    const panel = document.getElementById(toggle.getAttribute('aria-controls'));
    const open = toggle.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('.capability-item').forEach((other) => {
      const otherToggle = other.querySelector('.capability-toggle');
      const otherPanel = other.querySelector('.capability-panel');
      other.classList.toggle('is-open', other === item && !open);
      otherToggle.setAttribute('aria-expanded', String(other === item && !open));
      otherPanel.hidden = !(other === item && !open);
    });
    panel?.focus?.();
  });
});
