import { expect, test } from '@playwright/test';
import { join } from 'node:path';

test.beforeEach(async ({ page }) => {
  const resourceDirectory = process.env.PORTFOLIO_RESOURCE_DIR;
  if (!resourceDirectory) return;
  await page.route(
    'https://phemxy-kreative-designer-nvp0aa.v2.appdeploy.ai/resources/frame-*',
    async (route) => {
      const filename = new URL(route.request().url()).pathname
        .split('/')
        .pop()!;
      await route.fulfill({ path: join(resourceDirectory, filename) });
    },
  );
});

test('filter the expanded gallery and inspect a PDF branding project', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Phemxy — Kreative Designer');
  await expect(page.locator('.project:visible')).toHaveCount(25);
  await page.getByRole('button', { name: 'Packaging', exact: true }).click();
  await expect(page.locator('.project:visible')).toHaveCount(8);
  await expect(page.locator('.project:visible').first()).toContainText(
    'Gellas Food',
  );
  const plantain = page.locator('[data-project-id="gellas-plantain"]');
  await plantain.click();
  await expect(page.locator('#project-preview')).toHaveAttribute(
    'src',
    /frame-14\.jpg$/,
  );
  await expect(page.locator('#project-preview')).toHaveJSProperty(
    'naturalWidth',
    1150,
  );
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Branding', exact: true }).click();
  await expect(page.locator('.project:visible')).toHaveCount(3);
  const project = page.locator('[data-project-id="blinders-cut"]');
  await project.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('heading')).toHaveText(
    'Blinders Cut — Brand Identity',
  );
  await expect(dialog.locator('#project-preview')).toHaveJSProperty(
    'naturalWidth',
    1400,
  );
  await expect(
    dialog.getByRole('button', { name: 'Next project image' }),
  ).not.toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(project).toBeFocused();
  await page.getByRole('button', { name: 'All work', exact: true }).click();
  await expect(page.locator('.project:visible')).toHaveCount(25);
});

test('mobile visitors can reach the updated portrait, services, and contact', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Menu +' });
  await menu.click();
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'Services', exact: true })
    .click();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#services article')).toHaveCount(4);
  await menu.click();
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'About me' })
    .click();
  await expect(page.locator('#about')).toContainText('brand specialist');
  await expect(page.locator('#about img')).toHaveAttribute(
    'src',
    /frame-01\.png$/,
  );
  await expect(page.locator('#about img')).toHaveAttribute(
    'alt',
    /purple studio background/,
  );
  await page
    .getByRole('link', { name: 'Let’s create something together' })
    .click();
  await expect(page).toHaveURL(/#contact$/);
  const socialLinks = page.locator('#contact .social-links a');
  await expect(socialLinks).toHaveCount(5);
  const expectedProfiles = {
    Pinterest: 'https://pin.it/37pguH1BK',
    Facebook: 'https://www.facebook.com/share/1DbZWNgLWM/',
    Instagram: 'https://www.instagram.com/phemxy7?obrf=aXZ0MGwwano5cmZ6',
    X: 'https://x.com/Phemxy7',
    TikTok: 'https://www.tiktok.com/@phemxy7?_r=1&_t=ZS-9BIPNDBb0vU',
  };
  for (const [platform, destination] of Object.entries(expectedProfiles)) {
    const link = page.getByRole('link', {
      name: `Phemxy7 on ${platform}`,
      exact: true,
    });
    await expect(link).toHaveAttribute('href', destination);
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  }
  await expect(
    page.getByRole('link', { name: 'Say hello by email' }),
  ).toHaveAttribute('href', 'mailto:helfhelm7@gmail.com');
  await expect(
    page.getByRole('link', { name: '+234 810 237 3011' }),
  ).toHaveAttribute('href', 'tel:+2348102373011');
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test('multi-image projects support buttons, thumbnails, keyboard, and a safe exit', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.marquee-track')).toHaveCSS(
    'animation-name',
    'none',
  );
  await page
    .getByRole('button', { name: 'Print & events', exact: true })
    .click();
  const project = page.locator('[data-project-id="blessing-moyosore"]');
  await project.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.locator('#project-preview')).toHaveAttribute(
    'src',
    /frame-02\.jpg$/,
  );
  await dialog.getByRole('button', { name: 'Next project image' }).click();
  await expect(dialog.locator('#project-preview')).toHaveAttribute(
    'src',
    /frame-03\.jpg$/,
  );
  await expect(dialog.locator('#project-preview')).toHaveJSProperty(
    'naturalWidth',
    1280,
  );
  await expect(dialog.getByRole('status')).toHaveText('2 / 3');
  await dialog.getByRole('button', { name: 'View image 3 of 3' }).click();
  await expect(dialog.locator('#project-preview')).toHaveAttribute(
    'src',
    /frame-05\.jpg$/,
  );
  await expect(dialog.locator('#project-preview')).toHaveJSProperty(
    'naturalWidth',
    3000,
  );
  await page.keyboard.press('ArrowLeft');
  await expect(dialog.getByRole('status')).toHaveText('2 / 3');
  await dialog.getByRole('button', { name: 'Previous project image' }).click();
  await expect(dialog.getByRole('status')).toHaveText('1 / 3');
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(project).toBeFocused();
  await project.click();
  await dialog.getByRole('link', { name: 'Discuss a similar project' }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page).toHaveURL(/#contact$/);
  await expect(
    page.getByRole('link', { name: 'Say hello by email' }),
  ).toBeInViewport();
});

test('PDF artwork loads and the expanded layout stays within each viewport', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  for (const width of [375, 390, 600, 768, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `Overflow at ${width}px`,
    ).toBe(true);
  }
  const pdfImages = page.locator(
    '.project img[src*="pdf-"], .project img[src*="branding-slide-"]',
  );
  await expect(pdfImages).toHaveCount(5);
  for (const image of await pdfImages.all()) {
    await image.evaluate((element) =>
      element.scrollIntoView({ block: 'center', behavior: 'instant' }),
    );
    await expect
      .poll(() =>
        image.evaluate((element) => {
          const img = element as HTMLImageElement;
          return img.complete && img.naturalWidth > 0;
        }),
      )
      .toBe(true);
  }
  await expect(page.locator('.project img').first()).toHaveCSS(
    'object-fit',
    'contain',
  );
  expect(errors).toEqual([]);
});

test('the smaller logo aligns left and motion remains controllable', async ({
  page,
}) => {
  await page.goto('/');
  const logo = page
    .getByRole('banner')
    .getByRole('img', { name: 'Phemxy Concepts', exact: true });
  const logoBox = await logo.boundingBox();
  const navBox = await page.getByRole('navigation').boundingBox();
  expect(logoBox!.x + logoBox!.width).toBeLessThan(navBox!.x);
  expect(logoBox!.width).toBeLessThan(210);
  const track = page.locator('.marquee-track');
  const initial = await track.evaluate(
    (element) => getComputedStyle(element).transform,
  );
  await expect
    .poll(() =>
      track.evaluate((element) => getComputedStyle(element).transform),
    )
    .not.toBe(initial);
  await page.getByRole('button', { name: 'Pause motion', exact: true }).click();
  await expect(track).toHaveCSS('animation-play-state', 'paused');
  await page.getByRole('button', { name: 'Play motion', exact: true }).click();
  await expect(track).toHaveCSS('animation-play-state', 'running');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(
    page.getByRole('button', { name: 'Reduced motion', exact: true }),
  ).toBeDisabled();
  await expect(track).toHaveCSS('animation-name', 'none');
  await page.setViewportSize({ width: 375, height: 667 });
  const menu = page.getByRole('button', { name: 'Menu +' });
  await menu.click();
  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toBeFocused();
});
