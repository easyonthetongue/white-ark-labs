const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-button');

menuButton?.addEventListener('click', () => {
  const isOpen = header.classList.toggle('menu-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.textContent = isOpen ? '×' : '☰';
});

const filterButtons = [...document.querySelectorAll('[data-filter]')];
const productCards = [...document.querySelectorAll('[data-category]')];
const count = document.querySelector('[data-product-count]');

function applyFilter(filter) {
  let visible = 0;
  productCards.forEach((card) => {
    const matches = filter === 'all' || card.dataset.category === filter;
    card.hidden = !matches;
    if (matches) visible += 1;
  });
  filterButtons.forEach((button) => {
    const active = button.dataset.filter === filter;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  if (count) count.textContent = `${visible} ${visible === 1 ? 'style' : 'styles'}`;
  const url = new URL(window.location.href);
  if (filter === 'all') url.searchParams.delete('category');
  else url.searchParams.set('category', filter);
  history.replaceState({}, '', url);
}

filterButtons.forEach((button) => button.addEventListener('click', () => applyFilter(button.dataset.filter)));
if (filterButtons.length) {
  const requested = new URLSearchParams(window.location.search).get('category');
  applyFilter(filterButtons.some((button) => button.dataset.filter === requested) ? requested : 'all');
}

const quoteForm = document.querySelector('[data-quote-form]');
if (quoteForm) {
  const params = new URLSearchParams(window.location.search);
  const productField = quoteForm.elements.product;
  if (params.get('product') && [...productField.options].some((option) => option.value === params.get('product'))) {
    productField.value = params.get('product');
  }

  quoteForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!quoteForm.reportValidity()) return;
    const data = new FormData(quoteForm);
    const selected = productField.options[productField.selectedIndex]?.text || 'General enquiry';
    const subject = `Quote request — ${selected}`;
    const body = [
      'FORME manufacturing enquiry', '',
      `Name: ${data.get('name')}`,
      `Company: ${data.get('company')}`,
      `Email: ${data.get('email')}`,
      `Product: ${selected}`,
      `Estimated quantity: ${data.get('quantity') || 'Not specified'}`,
      `Target delivery: ${data.get('delivery') || 'Not specified'}`,
      '', 'Project brief:', data.get('brief')
    ].join('\n');
    const recipient = quoteForm.dataset.recipient || '';
    const mailto = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const status = quoteForm.querySelector('.form-status');
    status.textContent = recipient
      ? 'Your email app is opening with the completed brief.'
      : 'Your email app is opening with the completed brief. Add the recipient before sending.';
    window.location.href = mailto;
  });
}
