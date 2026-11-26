# Phemxy — Kreative Designer

Responsive portfolio for Phemxy, a brand specialist behind Phemxy Concepts. The site includes selected branding and product work, services, an introduction, and email and telephone contact links. The gallery groups 24 newly supplied work images into 20 projects and adds three selections from the original PDF plus both slides from the additional branding PDF. Related packaging views and event items can be browsed inside a project using buttons, thumbnails, or arrow keys. Its magenta, plum, orange, and white palette comes from the supplied portfolio PDF. The centered hero, staggered entrances, floating work cards, rotating service text, and continuous marquee follow the requested Upscayl direction. System reduced-motion preferences are respected.

## Run locally

Use Node.js 22 or newer and npm:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite.

## Build and preview

```sh
npm run build
npm run preview
```

The production site is generated in `dist/`. Its relative asset paths support hosting at a domain root or a repository subdirectory. Cloudflare Pages serves the generated files. The production URL is https://phemxyconcepts.pages.dev/.

## Browser checks

```sh
npx playwright install chromium
npm run build
npm test
```

To use an existing Chromium installation, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to its executable path when running the tests. The checks cover project filters and previews, keyboard dismissal and focus, mobile navigation, contact links, reduced motion, image loading, and layout overflow.

If the environment blocks the public AppDeploy image host, set `PORTFOLIO_RESOURCE_DIR` to a local directory containing the actual deployed `frame-*.jpg` and `frame-01.png` files when running browser checks. The tests then use those same image bytes locally.

## Edit the portfolio

- `index.html`: title, biography, services, hero images, and contact links.
- `src/styles.css`: responsive styles, colors, and motion.
- `src/main.ts`: navigation, project filters, multi-image previews, and motion controls.
- `src/projects.ts`: project descriptions, categories, and image groups.
- `docs/portfolio-image-map.md`: the image-to-project mapping checked against the deployed artwork. Frame numbers are storage names, not attachment positions.
- `public/resources/`: images extracted from the supplied portfolio PDF.
- The logo, portrait, and work images are retained in public/resources and deployed with the site. Pinned GitHub copies remain available for image recovery.
- The logo is smaller and left-aligned. Explicit type sizes are increased by 1px, including responsive headings; project descriptions have an additional 2pt increase; the About image uses a top-centered three-quarter crop inside its 4:5 frame, keeping the face and upper trousers prominent.
- `tests/portfolio.spec.ts`: executable browser checks.
- `tests/tests.json`: workflow descriptions prepared for AppDeploy validation.

The visible title is **Phemxy — Kreative Designer**. The biography describes Phemxy as a **brand specialist**, lists an HND in Computer Engineering from Yaba College of Technology, Lagos (2025), and includes Figma in the skills. The gallery includes the newly supplied artwork and branding slides. Contact details come from the original PDF, and the five social icons use the exact owner-supplied URLs for Pinterest, Facebook, Instagram, X, and TikTok, displayed as Phemxy7.

## Image delivery and sharing

The repository now keeps the 24 supplied work images, the original logo, and a
lighter JPEG copy of the supplied portrait in `public/resources/`. The portrait
retains its original 1122 × 1402 dimensions and uses the same CSS crop.
AppDeploy retains the original uploaded PNG as a fallback for the portrait.

`src/media.ts` recovers failed artwork requests using pinned copies in this
repository. A project preview shows a connection message and Retry image control
if both sources fail. No substitute artwork is used. The gallery's primary image
paths follow the current site rather than a hard-coded AppDeploy hostname.

The HTML includes a canonical URL, Open Graph and X card metadata referencing the
real 1200 × 628 branded `share-preview.png`, plus a sitemap and robots file.
Selected project views include artwork-based design notes; client briefs,
outcomes, and testimonials should be added only when supplied by the owner.

Validation for this update uses AppDeploy's Vite 8 build and its desktop/mobile
QA because the attached workspace failed to start. The local Playwright suite
includes a focused image-recovery test for the next available execution run.

## Client testimonials

The feature is published on the Cloudflare Pages site.

The Client voices section is placed between About and Contact. It displays the
owner-supplied reviews from Abatox Global, Mr. John at OK Prints, and Mrs. Jemilat.
The review wording is retained in `src/testimonial-data.ts`; client names, roles,
service labels, and optional avatar URLs are edited there.

`src/testimonials.ts` provides a three-card desktop composition with a prominent
center review, one visible card through 1100px (phones and tablets), previous/next buttons, pagination,
keyboard arrows/Home/End, and touch swipes. Reviews advance only when the visitor
navigates. The layout uses the widest available compact card, fluid quote typography,
equal-height desktop cards, and a shared grid cell for the compact reviews.
It reserves space for the longest review to avoid a jump when changing cards, and honors the system reduced-motion preference. Initials are
shown when a client photo is not supplied.

Empty review lists stay hidden. One review has no navigation controls; two
reviews are shown without duplicating an entry. `tests/testimonials.spec.ts`
covers the supplied content, responsive navigation, focus, swipe, and reduced
motion. The GitHub workflow runs TypeScript checking, a production build, and the
browser suite, and saves desktop/mobile testimonial screenshots in its
portfolio-browser-results artifact. Breakpoint regression checks cover readable card/quote widths, unclipped
content, stable carousel height, non-overlapping desktop cards, and touch targets
from 320px through 1440px.

## Hero and services

The hero states the full offer: From brand identity to the final print.
Its three artwork examples open the matching branding, packaging, and event-print
project previews. Desktop retains floating cards; smaller screens use a native
horizontal gallery with a visible browsing hint. Full artwork uses contain
framing, and the reduced-motion setting remains supported.

Services follow the supplied reference: a centered heading and four numbered,
text-only entries separated by fine rules. Full branding, Logo design,
Print & packaging, and Promotional design form two columns on desktop and
one column on phones. Each includes its description and a plain deliverables
line. Project examples remain accessible from the hero and selected-work gallery.
Service descriptions retain the enlarged text size.

The changes use the agreed initial direction from the existing-site audit.
The attached reference video was not viewed because the execution workspace
remained unavailable. The latest source is deployed through the Cloudflare Pages GitHub connection. GitHub checks include desktop/mobile hero and services screenshots in
the portfolio-browser-results artifact.

## Cloudflare Pages hosting

Production: https://phemxyconcepts.pages.dev/

The `phemxyconcepts` Pages project is connected to
`Phemxy/Portfolio-Page`. Pushes to `main` automatically build and publish
production; other branches get preview deployments. The build command is
`npm run build`, the output directory is `dist`, and the root directory is
`/`. Both environments use build image v3 and Node.js 24. Pull-request comments
are disabled. Cloudflare stores its GitHub authorization; there are no token
values in this repository.

`public/404.html` provides a real not-found page and disables Pages' implicit
SPA fallback. Navigation within the portfolio uses hash links. Canonical,
Open Graph, social image, robots.txt, and sitemap URLs point to the Pages site.

The earlier Worker at https://portfolio-page.helfhelm7.workers.dev/ remains available as a
backup. `cloudflare.config.ts` and the `deploy:worker-backup` /
`check:worker-backup` scripts apply only to that Worker. Its deploy command
uses the pinned cf CLI to upload Vite's existing `dist/` output. Pages deploys
through its Git integration and does not need a separate CLI deployment step.

GitHub Actions type-checks and builds the site, validates the optional Worker
backup configuration, runs browser tests, and uploads desktop/mobile screenshots.
To retry a Pages build, use the project's Deployments page in Cloudflare.
