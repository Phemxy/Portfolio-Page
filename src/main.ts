import './styles.css';
import { projects, type PortfolioProject } from './projects';
import { installImageRecovery, setImageSource } from './media';
import { initTestimonials } from './testimonials';

initTestimonials();

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
const grid = document.querySelector<HTMLElement>('.projects')!;
const dialog = document.querySelector<HTMLDialogElement>('dialog')!;
const preview = document.querySelector<HTMLImageElement>('#project-preview')!;
const imageControls = document.querySelector<HTMLElement>(
  '.project-gallery-controls',
)!;
const thumbnails = document.querySelector<HTMLElement>('.project-thumbnails')!;
let opener: HTMLButtonElement | null = null;
let selectedProject: PortfolioProject | null = null;
let imageIndex = 0;
const imageRecovery = document.querySelector<HTMLElement>('#image-recovery')!;
const projectNotes = document.querySelector<HTMLElement>('#project-notes')!;

installImageRecovery(
  (image) => {
    if (image === preview) {
      preview.hidden = true;
      imageRecovery.hidden = false;
    }
  },
  (image) => {
    if (image === preview) {
      preview.hidden = false;
      imageRecovery.hidden = true;
    }
  },
);

document.querySelector('#retry-image')!.addEventListener('click', () => {
  if (!selectedProject) return;
  const source = new URL(selectedProject.images[imageIndex], document.baseURI);
  source.searchParams.set('retry', String(Date.now()));
  imageRecovery.hidden = true;
  setImageSource(preview, source.href);
});

function showProjectImage(index: number) {
  if (!selectedProject) return;
  imageIndex =
    (index + selectedProject.images.length) % selectedProject.images.length;
  imageRecovery.hidden = true;
  setImageSource(preview, selectedProject.images[imageIndex]);
  preview.alt = `${selectedProject.title}, view ${imageIndex + 1} of ${selectedProject.images.length}`;
  document.querySelector('#project-image-count')!.textContent =
    `${imageIndex + 1} / ${selectedProject.images.length}`;
  thumbnails.querySelectorAll('button').forEach((button, position) => {
    button.setAttribute('aria-current', String(position === imageIndex));
  });
}

function openProject(project: PortfolioProject, button: HTMLButtonElement) {
  opener = button;
  selectedProject = project;
  document.querySelector('#project-title')!.textContent = project.title;
  document.querySelector('#project-description')!.textContent =
    project.description;
  projectNotes.replaceChildren();
  projectNotes.hidden = !project.details;
  if (project.details) {
    const rows = [
      ['Design focus', project.details.focus],
      ['Shown in this project', project.details.deliverables.join(' · ')],
    ];
    rows.forEach(([label, value]) => {
      const term = document.createElement('dt');
      const detail = document.createElement('dd');
      term.textContent = label;
      detail.textContent = value;
      projectNotes.append(term, detail);
    });
  }
  imageControls.hidden = project.images.length < 2;
  thumbnails.replaceChildren();
  if (project.images.length > 1) {
    project.images.forEach((source, index) => {
      const thumbnail = document.createElement('button');
      thumbnail.type = 'button';
      thumbnail.setAttribute(
        'aria-label',
        `View image ${index + 1} of ${project.images.length}`,
      );
      const image = document.createElement('img');
      setImageSource(image, source);
      image.alt = '';
      thumbnail.append(image);
      thumbnail.addEventListener('click', () => showProjectImage(index));
      thumbnails.append(thumbnail);
    });
  }
  showProjectImage(0);
  dialog.showModal();
}

const projectButtons = projects.map((project) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'project';
  button.dataset.category = project.category;
  button.dataset.projectId = project.id;
  button.innerHTML = `
    <div class="project-image">
      <img loading="lazy" decoding="async" alt="">
      <span class="project-arrow" aria-hidden="true">↗</span>
    </div>
    <div class="project-label"><h3></h3><span></span></div>
  `;
  const image = button.querySelector('img')!;
  setImageSource(image, project.images[0]);
  image.alt = project.title;
  button.querySelector('h3')!.textContent = project.title;
  button.querySelector('.project-label > span')!.textContent = project.category;
  if (project.images.length > 1) {
    const count = document.createElement('span');
    count.className = 'project-image-count';
    count.textContent = `${project.images.length} images`;
    button.querySelector('.project-image')!.append(count);
  }
  button.addEventListener('click', () => openProject(project, button));
  grid.append(button);
  return button;
});

document.querySelectorAll<HTMLButtonElement>('[data-project-preview]')
  .forEach((button) => {
    const project = projects.find((item) =>
      item.id === button.dataset.projectPreview,
    );
    if (!project) {
      button.disabled = true;
      return;
    }
    button.addEventListener('click', () => openProject(project, button));
  });

const filters = Array.from(
  document.querySelectorAll<HTMLButtonElement>('[data-filter]'),
);
filters.forEach((filter) =>
  filter.addEventListener('click', () => {
    filters.forEach((button) => {
      button.classList.toggle('active', button === filter);
      button.setAttribute('aria-pressed', String(button === filter));
    });
    let count = 0;
    projectButtons.forEach((button) => {
      button.hidden =
        filter.dataset.filter !== 'All' &&
        button.dataset.category !== filter.dataset.filter;
      if (!button.hidden) count += 1;
    });
    document.querySelector('#results')!.textContent = `${count} projects shown`;
  }),
);

document
  .querySelector('.gallery-previous')!
  .addEventListener('click', () => showProjectImage(imageIndex - 1));
document
  .querySelector('.gallery-next')!
  .addEventListener('click', () => showProjectImage(imageIndex + 1));
dialog.addEventListener('keydown', (event) => {
  if (!selectedProject || selectedProject.images.length < 2) return;
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault();
    showProjectImage(imageIndex + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
document
  .querySelector('.close')!
  .addEventListener('click', () => dialog.close());
document
  .querySelector('#project-contact')!
  .addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  )
    dialog.close();
});
dialog.addEventListener('close', () => opener?.focus({ preventScroll: true }));

const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const root = document.documentElement;
const header = document.querySelector<HTMLElement>('.site-header')!;
const showcase = document.querySelector<HTMLElement>('.hero-showcase')!;
const revealElements = Array.from(
  document.querySelectorAll<HTMLElement>('[data-reveal]'),
);
let revealObserver: IntersectionObserver | null = null;
let scrollFrame = 0;

function updateScrollAppearance() {
  scrollFrame = 0;
  header.classList.toggle('is-scrolled', scrollY > 12);
  showcase.style.setProperty(
    '--scroll-shift',
    motionPreference.matches ? '0px' : `${Math.min(scrollY * 0.08, 55)}px`,
  );

}

function applyMotionPreference() {
  const canReveal =
    !motionPreference.matches && 'IntersectionObserver' in window;
  root.classList.toggle('motion-ready', canReveal);
  revealObserver?.disconnect();

  if (!canReveal) {
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
}

motionPreference.addEventListener('change', () => {
  updateScrollAppearance();
  applyMotionPreference();
});
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
updateScrollAppearance();
applyMotionPreference();
