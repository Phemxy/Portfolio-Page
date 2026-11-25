# Phemxy — Kreative Designer

Responsive portfolio for Phemxy, a brand specialist behind Phemxy Concepts. The site includes selected branding and product work, services, an introduction, and email and telephone contact links. The gallery groups 24 newly supplied work images into 20 projects and adds three selections from the original PDF plus both slides from the additional branding PDF. Related packaging views and event items can be browsed inside a project using buttons, thumbnails, or arrow keys. Its magenta, plum, orange, and white palette comes from the supplied portfolio PDF. The centered hero, staggered entrances, floating work cards, rotating service text, and continuous marquee follow the requested Upscayl direction. Visitors can pause motion, and system reduced-motion changes take effect immediately.

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

The production site is generated in `dist/`. Its relative asset paths support hosting at a domain root or a repository subdirectory. The repository does not configure or publish a hosting service.

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
- The logo, updated portrait (frame 1), and new work images (frames 2–25) are uploaded AppDeploy resources. The HTML and project data use their hosted URLs so they also appear when the repository is hosted elsewhere.
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

The feature is saved in GitHub. Publishing it to AppDeploy is currently blocked
because the account's Free deployment window has expired; Lite or Plus is
required to publish the update.

The Client voices section is placed between About and Contact. It displays the
owner-supplied reviews from Abatox Global, Mr. John at OK Prints, and Mrs. Jemilat.
The review wording is retained in `src/testimonial-data.ts`; client names, roles,
service labels, and optional avatar URLs are edited there.

`src/testimonials.ts` provides a three-card desktop composition with a prominent
center review, one visible card on mobile, previous/next buttons, pagination,
keyboard arrows/Home/End, and touch swipes. Reviews advance only when the visitor
navigates. The layout reserves space for all mobile reviews to avoid a jump when
changing cards, and honors the system reduced-motion preference. Initials are
shown when a client photo is not supplied.

Empty review lists stay hidden. One review has no navigation controls; two
reviews are shown without duplicating an entry. `tests/testimonials.spec.ts`
covers the supplied content, responsive navigation, focus, swipe, and reduced
motion. The GitHub workflow runs TypeScript checking, a production build, and the
browser suite, and saves desktop/mobile testimonial screenshots in its
portfolio-browser-results artifact. The prepared AppDeploy build script also
adds TypeScript checking before Vite.
