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

## Edit the portfolio

- `index.html`: title, biography, services, project descriptions, and contact links.
- `src/styles.css`: responsive styles, colors, and motion.
- `src/main.ts`: navigation, project filters, multi-image previews, and motion controls.
- `src/projects.ts`: project descriptions, categories, and image groups.
- `public/resources/`: images extracted from the supplied portfolio PDF.
- The logo, updated portrait (frame 1), and new work images (frames 2–25) are uploaded AppDeploy resources. The HTML and project data use their hosted URLs so they also appear when the repository is hosted elsewhere.
- The logo is smaller and left-aligned. Explicit type sizes are increased by 1px, including responsive headings; the About portrait uses its full 4:5 composition.
- `tests/portfolio.spec.ts`: executable browser checks.
- `tests/tests.json`: workflow descriptions prepared for AppDeploy validation.

The visible title is **Phemxy — Kreative Designer**. The biography describes Phemxy as a **brand specialist**. The gallery includes the newly supplied artwork and branding slides. Contact details come from the original PDF, and the five social icons use the exact owner-supplied URLs for Pinterest, Facebook, Instagram, X, and TikTok, displayed as Phemxy7.
