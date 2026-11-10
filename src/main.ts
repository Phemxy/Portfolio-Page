import './styles.css';

const menu = document.querySelector<HTMLButtonElement>('.menu')!;
const navigation = document.querySelector<HTMLElement>('#navigation')!;
menu.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(expanded));
  navigation.classList.toggle('open', expanded);
  menu.textContent = expanded ? 'Close ×' : 'Menu +';
});
navigation.querySelectorAll('a').forEach((link) =>
  link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.textContent = 'Menu +';
  }),
);
const projects = Array.from(
  document.querySelectorAll<HTMLButtonElement>('.project'),
);
const filters = Array.from(
  document.querySelectorAll<HTMLButtonElement>('[data-filter]'),
);
filters.forEach((filter) =>
  filter.addEventListener('click', () => {
    filters.forEach((item) => {
      item.classList.toggle('active', item === filter);
      item.setAttribute('aria-pressed', String(item === filter));
    });
    let count = 0;
    projects.forEach((project) => {
      project.hidden =
        filter.dataset.filter !== 'All' &&
        project.dataset.category !== filter.dataset.filter;
      if (!project.hidden) count += 1;
    });
    document.querySelector('#results')!.textContent =
      `${count} project collections shown`;
  }),
);
const dialog = document.querySelector<HTMLDialogElement>('dialog')!;
let opener: HTMLButtonElement | null = null;
projects.forEach((project) =>
  project.addEventListener('click', () => {
    opener = project;
    const source = project.querySelector('img')!;
    const preview =
      document.querySelector<HTMLImageElement>('#project-preview')!;
    preview.src = source.src;
    preview.alt = source.alt;
    document.querySelector('#project-title')!.textContent =
      project.dataset.title || '';
    document.querySelector('#project-description')!.textContent =
      project.dataset.description || '';
    dialog.showModal();
  }),
);
document
  .querySelector('.close')!
  .addEventListener('click', () => dialog.close());
document
  .querySelector('#project-contact')!
  .addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) {
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      dialog.close();
  }
});
dialog.addEventListener('close', () => opener?.focus({ preventScroll: true }));

const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const motionToggle =
  document.querySelector<HTMLButtonElement>('.motion-toggle')!;
const root = document.documentElement;
const header = document.querySelector<HTMLElement>('.site-header')!;
const showcase = document.querySelector<HTMLElement>('.hero-showcase')!;
const revealElements = Array.from(
  document.querySelectorAll<HTMLElement>('[data-reveal]'),
);
let pausedByVisitor = false;
let revealObserver: IntersectionObserver | null = null;
let scrollFrame = 0;

function updateScrollAppearance() {
  scrollFrame = 0;
  header.classList.toggle('is-scrolled', scrollY > 12);
  const reduced = motionPreference.matches || pausedByVisitor;
  showcase.style.setProperty(
    '--scroll-shift',
    reduced ? '0px' : `${Math.min(scrollY * 0.08, 55)}px`,
  );
}

function applyMotionPreference() {
  const reduced = motionPreference.matches;
  const paused = reduced || pausedByVisitor;
  root.classList.toggle('motion-ready', !paused);
  root.classList.toggle('motion-paused', paused);
  motionToggle.disabled = reduced;
  motionToggle.setAttribute('aria-pressed', String(paused));
  motionToggle.textContent = reduced
    ? 'Reduced motion'
    : paused
      ? 'Play motion'
      : 'Pause motion';
  revealObserver?.disconnect();

  if (paused || !('IntersectionObserver' in window)) {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  } else {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -20px 0px' },
    );
    revealElements.forEach((element) => revealObserver!.observe(element));
  }
  updateScrollAppearance();
}

motionToggle.addEventListener('click', () => {
  pausedByVisitor = !pausedByVisitor;
  applyMotionPreference();
});
motionPreference.addEventListener('change', applyMotionPreference);
window.addEventListener(
  'scroll',
  () => {
    if (!scrollFrame)
      scrollFrame = requestAnimationFrame(updateScrollAppearance);
  },
  { passive: true },
);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    navigation.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.textContent = 'Menu +';
    menu.focus();
  }
});
applyMotionPreference();
