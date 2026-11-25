import { clientTestimonials, type ClientTestimonial } from './testimonial-data';

export function reviewWindow(
  count: number,
  current: number,
  compact: boolean,
): number[] {
  if (count < 1) return [];
  const active = ((current % count) + count) % count;
  if (compact || count === 1) return [active];
  if (count === 2) return [active, (active + 1) % count];
  return [(active + count - 1) % count, active, (active + 1) % count];
}

function createReviewCard(
  review: ClientTestimonial,
  index: number,
  count: number,
  position: string,
): HTMLLIElement {
  const slot = document.createElement('li');
  slot.className = 'testimonial-slot';
  slot.dataset.position = position;
  slot.dataset.reviewIndex = String(index);

  const card = document.createElement('figure');
  card.className = 'testimonial-card';
  card.setAttribute('role', 'group');
  card.setAttribute('aria-roledescription', 'slide');
  card.setAttribute('aria-label', `Testimonial ${index + 1} of ${count}`);

  const caption = document.createElement('figcaption');
  caption.className = 'testimonial-author';
  const avatar = document.createElement('span');
  avatar.className = 'testimonial-avatar';
  avatar.setAttribute('aria-hidden', 'true');
  avatar.textContent = review.client.trim().split(/\s+/)
    .slice(0, 2).map((word) => word[0]).join('').toUpperCase();
  if (review.avatarUrl) {
    let source: URL | null = null;
    try {
      source = new URL(review.avatarUrl, document.baseURI);
    } catch {
      source = null;
    }
    if (source && (source.protocol === 'https:' || source.protocol === 'http:')) {
      const image = document.createElement('img');
      image.src = source.href;
      image.alt = '';
      image.width = 60;
      image.height = 60;
      image.loading = 'lazy';
      image.decoding = 'async';
      image.addEventListener('error', () => image.remove(), { once: true });
      avatar.append(image);
    }
  }
  const client = document.createElement('strong');
  client.textContent = review.client;
  caption.append(avatar, client);
  if (review.role) {
    const role = document.createElement('span');
    role.className = 'testimonial-role';
    role.textContent = review.role;
    caption.append(role);
  }
  const service = document.createElement('span');
  service.className = 'testimonial-service';
  service.textContent = review.service;
  caption.append(service);

  const mark = document.createElement('span');
  mark.className = 'testimonial-quote-mark';
  mark.setAttribute('aria-hidden', 'true');
  mark.textContent = '“';
  const quote = document.createElement('blockquote');
  const words = document.createElement('p');
  words.textContent = review.quote;
  quote.append(words);
  card.append(caption, mark, quote);
  slot.append(card);
  return slot;
}

export function initTestimonials() {
  const section = document.querySelector<HTMLElement>('#testimonials');
  if (!section) return;
  const supplied = clientTestimonials.filter((review) =>
    review.quote.trim() && review.client.trim() && review.service.trim(),
  );
  const reviews = supplied;
  if (reviews.length === 0) return;

  section.hidden = false;
  const stage = section.querySelector<HTMLElement>('.testimonial-stage')!;
  const cards = section.querySelector<HTMLUListElement>('.testimonial-cards')!;
  const controls = section.querySelector<HTMLElement>('.testimonial-controls')!;
  const pagination = section.querySelector<HTMLElement>('.testimonial-pagination')!;
  const count = section.querySelector<HTMLElement>('.testimonial-count')!;
  const announcement = section.querySelector<HTMLElement>('.testimonial-announcement')!;
  const compact = matchMedia('(max-width: 700px)');
  let active = 0;

  controls.hidden = reviews.length < 2;
  if (reviews.length > 1) {
    stage.tabIndex = 0;
    stage.setAttribute('aria-keyshortcuts', 'ArrowLeft ArrowRight Home End');
    stage.setAttribute('aria-label',
      'Client testimonials. Use left and right arrow keys to browse.');
  }
  const dots = reviews.map((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'testimonial-dot';
    dot.setAttribute('aria-label', `Show testimonial ${index + 1}`);
    dot.setAttribute('aria-controls', 'testimonial-cards');
    dot.addEventListener('click', () => select(index));
    pagination.append(dot);
    return dot;
  });

  function render(announce = false) {
    const indices = reviewWindow(reviews.length, active, compact.matches);
    cards.dataset.count = String(indices.length);
    cards.dataset.compact = String(compact.matches);
    const rendered = compact.matches ? reviews.map((_, index) => index) : indices;
    cards.replaceChildren(...rendered.map((index) => {
      const position = index === active ? 'active' :
        reviews.length > 2 && index === (active + reviews.length - 1) % reviews.length
          ? 'previous' : 'next';
      const card = createReviewCard(reviews[index], index, reviews.length, position);
      if (compact.matches && index !== active) {
        card.setAttribute('aria-hidden', 'true');
      }
      return card;
    }));
    dots.forEach((dot, index) => {
      dot.setAttribute('aria-current', String(index === active));
    });
    count.textContent =
      `${String(active + 1).padStart(2, '0')} / ${String(reviews.length).padStart(2, '0')}`;
    if (announce) {
      announcement.textContent =
        `Testimonial ${active + 1} of ${reviews.length}. ${reviews[active].service}.`;
    }
  }

  function select(index: number) {
    active = ((index % reviews.length) + reviews.length) % reviews.length;
    render(true);
  }

  section.querySelector('.testimonial-previous')!.addEventListener('click', () => {
    select(active - 1);
  });
  section.querySelector('.testimonial-next')!.addEventListener('click', () => {
    select(active + 1);
  });
  stage.addEventListener('keydown', (event) => {
    if (reviews.length < 2) return;
    const target = event.key === 'ArrowLeft' ? active - 1 :
      event.key === 'ArrowRight' ? active + 1 :
      event.key === 'Home' ? 0 :
      event.key === 'End' ? reviews.length - 1 : null;
    if (target !== null) {
      event.preventDefault();
      select(target);
    }
  });

  let gesture: { x: number; y: number; pointerId: number } | null = null;
  stage.addEventListener('pointerdown', (event) => {
    if (reviews.length < 2 || event.pointerType === 'mouse' || gesture) return;
    gesture = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
  });
  window.addEventListener('pointercancel', () => { gesture = null; });
  window.addEventListener('pointerup', (event) => {
    if (!gesture || event.pointerId !== gesture.pointerId) return;
    const horizontal = event.clientX - gesture.x;
    const vertical = event.clientY - gesture.y;
    gesture = null;
    if (Math.abs(horizontal) > 50 &&
        Math.abs(horizontal) > Math.abs(vertical) * 1.3) {
      select(active + (horizontal < 0 ? 1 : -1));
    }
  });
  compact.addEventListener('change', () => render());
  render();

}
