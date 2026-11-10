import { expect, test } from '@playwright/test';

test('filter projects, inspect details, and return to the gallery', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Phemxy — Kreative Designer');
  await page.getByRole('button', { name: 'Branding', exact: true }).click();
  await expect(page.locator('.project:visible')).toHaveCount(1);
  const project = page.locator('.project:visible');
  await project.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading')).toHaveText(
    'Identities with character',
  );
  await expect(dialog.locator('img')).toHaveJSProperty('naturalWidth', 1200);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(project).toBeFocused();
  await page
    .getByRole('button', { name: 'Product & print', exact: true })
    .click();
  await expect(page.locator('.project:visible')).toHaveCount(1);
  await expect(page.locator('.project:visible')).toContainText(
    'Designed for the everyday',
  );
  await page.getByRole('button', { name: 'All work', exact: true }).click();
  await expect(page.locator('.project:visible')).toHaveCount(2);
});

test('mobile menu reaches services, about, and contact', async ({ page }) => {
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
  await page
    .getByRole('link', { name: 'Let’s create something together' })
    .click();
  await expect(page).toHaveURL(/#contact$/);
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

test('reduced motion preserves project viewing and enquiry', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.marquee > div')).toHaveCSS(
    'animation-name',
    'none',
  );
  await expect(page.locator('.rotating-track')).toHaveCSS(
    'animation-name',
    'none',
  );
  await page.locator('.project').first().click();
  await page.getByRole('button', { name: 'Close project' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.locator('.project').first().click();
  await page.getByRole('link', { name: 'Discuss a similar project' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page).toHaveURL(/#contact$/);
  await expect(
    page.getByRole('link', { name: 'Say hello by email' }),
  ).toBeInViewport();
});

test('images load without script errors or horizontal overflow', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  for (const width of [375, 768, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  for (const image of await page.locator('main img').all()) {
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
  expect(errors).toEqual([]);
});

test('brand logo aligns right and visitors can pause motion', async ({
  page,
}) => {
  await page.goto('/');
  const logo = page
    .getByRole('banner')
    .getByRole('img', { name: 'Phemxy Concepts', exact: true });
  await expect(logo).toHaveAttribute('src', /resources\/phemxy-logo\.png$/);
  const logoBox = await logo.boundingBox();
  const navigationBox = await page.getByRole('navigation').boundingBox();
  expect(logoBox!.x).toBeGreaterThan(navigationBox!.x + navigationBox!.width);
  const track = page.locator('.marquee-track');
  const initialTransform = await track.evaluate(
    (element) => getComputedStyle(element).transform,
  );
  await expect
    .poll(() =>
      track.evaluate((element) => getComputedStyle(element).transform),
    )
    .not.toBe(initialTransform);
  await page.getByRole('button', { name: 'Pause motion', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Play motion', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
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
