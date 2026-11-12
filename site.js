const root = document.documentElement;
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const hero = document.querySelector('.hero');
const heroMedia = document.querySelector('.hero-media');
const visual = document.querySelector('.hero-visual');
const topbar = document.querySelector('.topbar');
const navLinks = Array.from(topbar.querySelectorAll('nav a, .topbar-end'));
const navSections = navLinks.map(link => document.querySelector(link.hash));

let frame = 0;
let targetX = 0;
let targetY = 0;
let driftX = 0;
let driftY = 0;

function updateFrame() {
  frame = 0;
  const scroll = Math.max(0, window.scrollY);
  const pageHeight = root.scrollHeight - window.innerHeight;
  const headerHeight = topbar.offsetHeight;
  const endOfPage = pageHeight > 0 && scroll >= pageHeight - 2;
  let activeIndex = -1;

  navSections.forEach((section, index) => {
    if (section.getBoundingClientRect().top <= headerHeight + 48) activeIndex = index;
  });
  if (endOfPage) activeIndex = navSections.length - 1;

  navLinks.forEach((link, index) => {
    if (index === activeIndex) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  topbar.classList.toggle('scrolled', scroll > 20);
  topbar.style.setProperty('--progress', pageHeight > 0 ? Math.min(scroll / pageHeight, 1) : 0);

  if (motion.matches || !finePointer.matches || scroll > hero.offsetHeight) return;

  driftX += (targetX - driftX) * .12;
  driftY += (targetY - driftY) * .12;
  const scrollDrift = Math.min(scroll * .035, 20);
  visual.style.setProperty('--drift-x', `${driftX.toFixed(2)}px`);
  visual.style.setProperty('--drift-y', `${(driftY + scrollDrift).toFixed(2)}px`);
  if (Math.abs(targetX - driftX) + Math.abs(targetY - driftY) > .15) scheduleFrame();
}

function scheduleFrame() {
  if (!frame) frame = requestAnimationFrame(updateFrame);
}

function resetDrift() {
  targetX = 0;
  targetY = 0;
  scheduleFrame();
}

function resetMotion() {
  driftX = 0;
  driftY = 0;
  visual.style.removeProperty('--drift-x');
  visual.style.removeProperty('--drift-y');
  resetDrift();
}

window.addEventListener('scroll', scheduleFrame, { passive: true });
window.addEventListener('resize', scheduleFrame, { passive: true });
motion.addEventListener('change', resetMotion);
finePointer.addEventListener('change', resetMotion);
heroMedia.addEventListener('pointermove', event => {
  if (motion.matches || !finePointer.matches || event.pointerType === 'touch') return;
  const bounds = heroMedia.getBoundingClientRect();
  targetX = ((event.clientX - bounds.left) / bounds.width - .5) * -15;
  targetY = ((event.clientY - bounds.top) / bounds.height - .5) * -11;
  scheduleFrame();
});
heroMedia.addEventListener('pointerleave', resetDrift);
scheduleFrame();

function animateIn(element, delay = 0) {
  if (motion.matches || !element.animate) return;
  element.animate(
    [{ opacity: .48, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }],
    { duration: 450, delay, fill: 'backwards', easing: 'cubic-bezier(.2,.75,.25,1)' },
  );
}

if ('IntersectionObserver' in window) {
  const reveals = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      if (!target.contains(document.activeElement)) animateIn(target);
      reveals.unobserve(target);
    });
  }, { threshold: .14 });
  document.querySelectorAll('.section-heading, .about-grid, .recognition, .writing-grid, .footer-main').forEach(element => reveals.observe(element));
}

motion.addEventListener('change', () => {
  if (motion.matches) document.getAnimations().filter(animation => !animation.animationName && !animation.transitionProperty).forEach(animation => animation.cancel());
});

const grid = document.querySelector('.film-grid');
const viewSwitch = document.querySelector('.view-switch');
const viewButtons = Array.from(viewSwitch.querySelectorAll('button'));
viewSwitch.hidden = false;

viewButtons.forEach(button => button.addEventListener('click', () => {
  if (grid.dataset.layout === button.dataset.view) return;
  grid.dataset.layout = button.dataset.view;
  viewButtons.forEach(option => option.setAttribute('aria-pressed', String(option === button)));
  Array.from(grid.children).forEach((card, index) => {
    card.getAnimations().forEach(animation => animation.cancel());
    animateIn(card, index * 45);
  });
  scheduleFrame();
}));

const dialog = document.querySelector('.project-dialog');
const projectLinks = Array.from(document.querySelectorAll('[data-project]'));
const projectDetails = document.querySelector('.film-details');
const dialogContent = dialog.querySelector('.dialog-content');
const closeButton = dialog.querySelector('[data-close]');
const dialogCount = dialog.querySelector('.dialog-count');
let currentProject = 0;
let trigger = null;
let backdropPressed = false;

function showProject(index) {
  currentProject = (index + projectLinks.length) % projectLinks.length;
  const project = document.getElementById(`project-${projectLinks[currentProject].dataset.project}`);
  dialogContent.getAnimations().forEach(animation => animation.cancel());
  dialogContent.replaceChildren(...Array.from(project.children, child => child.cloneNode(true)));
  dialogContent.querySelector('h3').id = 'project-title';
  dialogCount.textContent = `${String(currentProject + 1).padStart(2, '0')} / ${String(projectLinks.length).padStart(2, '0')}`;
  dialog.scrollTop = 0;
}

if (typeof dialog.showModal === 'function') {
  projectDetails.classList.add('dialog-ready');
  projectLinks.forEach((link, index) => link.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    trigger = link;
    showProject(index);
    dialog.showModal();
    closeButton.focus({ preventScroll: true });
  }));

  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    trigger?.focus({ preventScroll: true });
    trigger = null;
  });

  dialog.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => {
    showProject(currentProject + Number(button.dataset.step));
    animateIn(dialogContent);
    dialogContent.querySelector('h3').focus({ preventScroll: true });
  }));

  function isBackdrop(event) {
    if (event.target !== dialog) return false;
    const bounds = dialog.getBoundingClientRect();
    return event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
  }

  dialog.addEventListener('pointerdown', event => { backdropPressed = isBackdrop(event); });
  dialog.addEventListener('click', event => {
    if (backdropPressed && isBackdrop(event)) dialog.close();
    backdropPressed = false;
  });
}
