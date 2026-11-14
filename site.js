const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
const mobile = window.matchMedia('(max-width: 950px)');
const topbar = document.querySelector('.topbar');
const menu = topbar.querySelector('.menu-toggle');
const panel = topbar.querySelector('.nav-panel');
const navLinks = Array.from(topbar.querySelectorAll('nav a'));
const sections = Array.from(document.querySelectorAll('main [id]'))
  .filter(section => ['work', 'art', 'about', 'writing', 'contact'].includes(section.id));
let scrollFrame = 0;

function setMenu(open) {
  menu.setAttribute('aria-expanded', String(open));
  panel.classList.toggle('open', open);
  panel.inert = mobile.matches && !open;
}

topbar.classList.add('has-menu');
menu.hidden = false;
setMenu(false);
mobile.addEventListener('change', () => setMenu(false));
menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
topbar.addEventListener('click', event => {
  const link = event.target.closest('.nav-panel a, .nav-shortcuts a');
  if (!mobile.matches || event.defaultPrevented || !link) return;
  if (link.getAttribute('href').startsWith('#')) {
    const target = document.getElementById(link.hash === '#top' ? 'main' : link.hash.slice(1));
    target?.setAttribute('tabindex', '-1');
    target?.focus({ preventScroll: true });
  }
  setMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || menu.getAttribute('aria-expanded') !== 'true') return;
  setMenu(false);
  menu.focus();
});
document.addEventListener('click', event => {
  if (!topbar.contains(event.target) && menu.getAttribute('aria-expanded') === 'true') setMenu(false);
});

function updateScroll() {
  scrollFrame = 0;
  const position = Math.max(window.scrollY, 0);
  const range = document.documentElement.scrollHeight - window.innerHeight;
  topbar.style.setProperty('--progress', range > 0 ? Math.min(position / range, 1) : 0);
  topbar.classList.toggle('scrolled', position > 12);
  if (!sections.length) return;

  const active = sections.findLast(section => section.getBoundingClientRect().top <= topbar.offsetHeight + 72);
  const onPage = { work: '#work', art: 'art.html', about: 'about.html', writing: 'writing.html', contact: 'contact.html' };
  const current = range > 0 && position >= range - 4 ? 'contact.html' : onPage[active?.id] ?? '#top';
  navLinks.forEach(link => {
    if (link.getAttribute('href') === current) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}

function scheduleScroll() {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
}

window.addEventListener('scroll', scheduleScroll, { passive: true });
window.addEventListener('resize', scheduleScroll, { passive: true });
window.addEventListener('load', scheduleScroll);
scheduleScroll();

const dialog = document.querySelector('.lightbox');
const image = dialog.querySelector('img');
const caption = dialog.querySelector('figcaption');
const count = dialog.querySelector('.lightbox-count');
const close = dialog.querySelector('[data-close]');
const stage = dialog.querySelector('.lightbox-stage');
const steps = Array.from(dialog.querySelectorAll('[data-step]'));
const galleries = new Map();
let group = [];
let selected = 0;
let opener = null;
let backdropDown = false;
let touchStart = null;
let imageMotion = null;

function showImage(index) {
  selected = (index + group.length) % group.length;
  const link = group[selected];
  const thumbnail = link.querySelector('img');
  image.alt = thumbnail.alt;
  image.width = Number(link.dataset.width);
  image.height = Number(link.dataset.height);
  image.style.setProperty('--image-width', `${image.width}px`);
  image.style.setProperty('--image-scale', image.width < 320 ? 2.25 : 1);
  image.src = link.href;
  caption.textContent = link.dataset.caption;
  count.textContent = `${selected + 1} / ${group.length}`;
  steps.forEach(button => { button.hidden = group.length < 2; });
  imageMotion?.cancel();
  if (!motion.matches) imageMotion = image.animate([{ opacity: .52 }, { opacity: 1 }], { duration: 210 });
}

if (typeof dialog.showModal === 'function') {
  document.querySelectorAll('[data-lightbox]').forEach(link => {
    const key = link.dataset.lightbox;
    if (!galleries.has(key)) galleries.set(key, []);
    galleries.get(key).push(link);
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      group = galleries.get(key);
      opener = link;
      showImage(group.indexOf(link));
      dialog.showModal();
      close.focus({ preventScroll: true });
    });
  });

  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    opener?.focus({ preventScroll: true });
    opener = null;
    touchStart = null;
    backdropDown = false;
  });
  steps.forEach(button => button.addEventListener('click', () => showImage(selected + Number(button.dataset.step))));
  motion.addEventListener('change', event => { if (event.matches) imageMotion?.cancel(); });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Tab') {
      const controls = [close, ...steps.filter(button => !button.hidden)];
      const first = controls[0];
      const last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
      return;
    }
    if (group.length < 2 || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    showImage(selected + (event.key === 'ArrowRight' ? 1 : -1));
  });

  function isBackdrop(event) {
    if (event.target !== dialog) return false;
    const bounds = dialog.getBoundingClientRect();
    return event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
  }

  dialog.addEventListener('pointerdown', event => { backdropDown = isBackdrop(event); });
  dialog.addEventListener('click', event => {
    if (backdropDown && isBackdrop(event)) dialog.close();
    backdropDown = false;
  });

  stage.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch' && event.target === image) {
      touchStart = { x: event.clientX, y: event.clientY };
    }
  });
  stage.addEventListener('pointercancel', () => { touchStart = null; });
  stage.addEventListener('pointerup', event => {
    if (!touchStart) return;
    const offsetX = event.clientX - touchStart.x;
    const offsetY = event.clientY - touchStart.y;
    touchStart = null;
    if (group.length > 1 && Math.abs(offsetX) > 40 && Math.abs(offsetX) > Math.abs(offsetY) * 1.3) {
      showImage(selected + (offsetX < 0 ? 1 : -1));
    }
  });
}
