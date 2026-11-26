const backupRoot =
  'https://raw.githubusercontent.com/Phemxy/Portfolio-Page/73ec55ac7daead845262bcf5bda8802f221235bb/public/resources/';
const artworkNames = new Set([
  'phemxy-logo.png',
  ...Array.from({ length: 24 }, (_, index) =>
    `frame-${String(index + 2).padStart(2, '0')}.jpg`,
  ),
  'branding-slide-1.jpg',
  'branding-slide-2.jpg',
  'pdf-blinders-cut.jpg',
  'pdf-event-flyers.jpg',
  'pdf-wedding-programme.jpg',
]);
const originalSources = new WeakMap<HTMLImageElement, string>();
const attemptedFallback = new WeakSet<HTMLImageElement>();

function fallbackSource(source: string): string | null {
  const url = new URL(source, document.baseURI);
  const filename = url.pathname.split('/').pop()!;
  let fallback: string | null = null;
  if (filename === 'phemxy-logo-clean.png') {
    fallback = 'https://raw.githubusercontent.com/Phemxy/Portfolio-Page/3a16e68b70ff95a0597f5b4071fa4e5883359fc9/public/resources/phemxy-logo-clean.png';
  } else if (filename === 'frame-01.jpg') {
    fallback = new URL('./resources/frame-01.png', document.baseURI).href;
  } else if (filename === 'frame-01.png') {
    fallback = `${backupRoot}frame-01.jpg`;
  } else if (artworkNames.has(filename)) {
    fallback = `${backupRoot}${filename}`;
  }
  return fallback === url.href ? null : fallback;
}

export function setImageSource(image: HTMLImageElement, source: string) {
  originalSources.set(image, new URL(source, document.baseURI).href);
  attemptedFallback.delete(image);
  image.classList.remove('image-unavailable');
  image.hidden = false;
  image.src = source;
}

export function installImageRecovery(
  onFailure: (image: HTMLImageElement) => void,
  onLoad: (image: HTMLImageElement) => void,
) {
  function recover(image: HTMLImageElement) {
    const source = originalSources.get(image) || image.src;
    if (!source) return;
    const fallback = fallbackSource(source);
    if (fallback && !attemptedFallback.has(image)) {
      attemptedFallback.add(image);
      image.src = fallback;
      return;
    }
    image.classList.add('image-unavailable');
    onFailure(image);
  }

  document.addEventListener('error', (event) => {
    if (event.target instanceof HTMLImageElement) recover(event.target);
  }, true);
  document.addEventListener('load', (event) => {
    if (!(event.target instanceof HTMLImageElement)) return;
    event.target.classList.remove('image-unavailable');
    onLoad(event.target);
  }, true);

  document.querySelectorAll<HTMLImageElement>('img[src]').forEach((image) => {
    originalSources.set(image, image.src);
    if (image.complete && image.naturalWidth === 0) recover(image);
  });
}
