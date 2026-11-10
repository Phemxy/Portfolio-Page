import './styles.css';

const menu = document.querySelector<HTMLButtonElement>('.menu')!;
const navigation = document.querySelector<HTMLElement>('#navigation')!;
menu.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(expanded));
  navigation.classList.toggle('open', expanded);
  menu.textContent = expanded ? 'Close ×' : 'Menu +';
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navigation.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  menu.textContent = 'Menu +';
}));
const projects = Array.from(document.querySelectorAll<HTMLButtonElement>('.project'));
const filters = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-filter]'));
filters.forEach(filter => filter.addEventListener('click', () => {
  filters.forEach(item => {
    item.classList.toggle('active', item === filter);
    item.setAttribute('aria-pressed', String(item === filter));
  });
  let count = 0;
  projects.forEach(project => {
    project.hidden = filter.dataset.filter !== 'All' && project.dataset.category !== filter.dataset.filter;
    if (!project.hidden) count += 1;
  });
  document.querySelector('#results')!.textContent = `${count} project collections shown`;
}));
const dialog = document.querySelector<HTMLDialogElement>('dialog')!;
let opener: HTMLButtonElement | null = null;
projects.forEach(project => project.addEventListener('click', () => {
  opener = project;
  const source = project.querySelector('img')!;
  const preview = document.querySelector<HTMLImageElement>('#project-preview')!;
  preview.src = source.src;
  preview.alt = source.alt;
  document.querySelector('#project-title')!.textContent = project.dataset.title || '';
  document.querySelector('#project-description')!.textContent = project.dataset.description || '';
  dialog.showModal();
}));
document.querySelector('.close')!.addEventListener('click', () => dialog.close());
document.querySelector('#project-contact')!.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target === dialog) {
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  }
});
dialog.addEventListener('close', () => opener?.focus({ preventScroll: true }));
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.section-heading, .service-grid article, .about > div').forEach(element => observer.observe(element));
}
