const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false');
}));

let activeCategory = 'all';
const searchInput = document.querySelector('#menu-search');
function updateMenu() {
  const term = searchInput.value.trim().toLowerCase();
  let shown = 0;
  document.querySelectorAll('.product-card').forEach(card => {
    const categoryMatches = activeCategory === 'all' || card.dataset.category === activeCategory;
    const textMatches = !term || card.textContent.toLowerCase().includes(term);
    card.hidden = !(categoryMatches && textMatches);
    if (!card.hidden) shown++;
  });
  document.querySelector('.menu-note').hidden = activeCategory !== 'all' || Boolean(term);
  let empty = document.querySelector('.menu-empty');
  if (!shown) {
    if (!empty) { empty = document.createElement('p'); empty.className = 'menu-empty'; document.querySelector('.product-grid').append(empty); }
    empty.textContent = 'No matches in this selection. Try another search or ask us what’s available today.';
  } else if (empty) empty.remove();
}
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.filter').forEach(item => item.classList.toggle('active', item === button));
  activeCategory = button.dataset.filter;
  updateMenu();
}));
searchInput.addEventListener('input', updateMenu);

const details = {
  walnut: ['Walnut Brownie', 'A rich, fudgy chocolate brownie with crunchy walnuts. Listed at ₹60; please check today’s price and availability with the shop.', '₹60'],
  truffle: ['Choco Truffle Pastry', 'Chocolate sponge layered with creamy truffle and smooth chocolate ganache. Listed at ₹95; please check today’s price and availability with the shop.', '₹95'],
  fudgy: ['Fudgy Chocolate Pastry', 'A dense, rich chocolate pastry with a fudgy finish. Listed at ₹110; please check today’s price and availability with the shop.', '₹110'],
  pineapple: ['Pineapple Pastry', 'Light sponge layered with cream and sweet pineapple pieces. Listed at ₹70; please check today’s price and availability with the shop.', '₹70'],
  ecstasy: ['Choco Ecstacy Pastry', 'Chocolate pastry layered with creamy goodness and cashews. Listed at ₹125; please check today’s price and availability with the shop.', '₹125'],
  truffleCake: ['Choco Truffle Cake · 450 g', 'Rich, moist chocolate cake layered with smooth ganache. The public listing confirms the item and size, but a current price was not available; please ask the shop.', 'Ask for price']
};
const dialog = document.querySelector('.detail-dialog');
document.querySelectorAll('[data-detail]').forEach(button => button.addEventListener('click', () => {
  const [title, description, price] = details[button.dataset.detail];
  document.querySelector('.dialog-title').textContent = title;
  document.querySelector('.dialog-description').textContent = description;
  document.querySelector('.dialog-price').textContent = price;
  const message = `Hi Brownies Haldwani, I'd like to order ${title}. Please confirm availability.`;
  document.querySelector('.dialog-order').href = `https://wa.me/918958400075?text=${encodeURIComponent(message)}`;
  dialog.showModal();
}));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('open')) nav.classList.remove('open'); });

document.querySelector('#year').textContent = new Date().getFullYear();
const cinema = document.querySelector('.cinema');
const cinemaPhoto = document.querySelector('.cinema-photo');
let cinemaTick = false;
function updateCinema() {
  const rect = cinema.getBoundingClientRect();
  const travel = Math.max(1, cinema.offsetHeight - document.querySelector('.cinema-stage').offsetHeight);
  const progress = Math.max(0, Math.min(1, -rect.top / travel));
  cinemaPhoto.style.scale = `${0.96 + progress * 0.06}`;
  cinema.style.setProperty('--cinema-progress', progress.toFixed(3));
  cinemaTick = false;
}
window.addEventListener('scroll', () => {
  if (!cinemaTick && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.requestAnimationFrame(updateCinema); cinemaTick = true;
  }
}, { passive: true });
updateCinema();
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(node => observer.observe(node));
} else document.querySelectorAll('.reveal').forEach(node => node.classList.add('visible'));
