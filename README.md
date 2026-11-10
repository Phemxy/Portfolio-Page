# Phemxy — Kreative Designer

Responsive portfolio for Phemxy, a brand specialist behind Phemxy Concepts. The site includes selected branding and product work, services, an introduction, and email and telephone contact links. Its magenta, plum, orange, and white palette comes from the supplied portfolio PDF.

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
- `src/main.ts`: navigation, project filters, and accessible image dialogs.
- `public/resources/`: images extracted from the supplied portfolio PDF.
- `tests/portfolio.spec.ts`: executable browser checks.
- `tests/tests.json`: workflow descriptions prepared for AppDeploy validation.

The visible title is **Phemxy — Kreative Designer**. The biography describes Phemxy as a **brand specialist**. The current artwork and contact details come from the supplied PDF and can be updated with newer material.
