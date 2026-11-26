import { expect, test } from '@playwright/test';

test('hero previews and restored services remain accessible', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const hero = page.locator('.hero');
  await expect(hero.getByRole('heading', { level: 1 }))
    .toHaveText(/From brand identity\s*to the final print\./);
  await expect(hero.locator('.intro')).toContainText('brand specialist');
  await expect(hero.locator('.showcase-card')).toHaveCount(3);
  for (const image of await hero.locator('.showcase-card img').all()) {
    await expect.poll(() => image.evaluate((element) =>
      (element as HTMLImageElement).naturalWidth,
    )).toBeGreaterThan(0);
    await expect(image).toHaveCSS('object-fit', 'contain');
  }
  await hero.screenshot({
    path: 'test-results/hero-desktop.png', animations: 'disabled',
  });
  const heroExample = hero.getByRole('button', {
    name: 'Open brand identity project',
  });
  await heroExample.click();
  await expect(page.locator('#project-title'))
    .toHaveText('Blinders Cut — Brand Identity');
  await page.keyboard.press('Escape');
  await expect(heroExample).toBeFocused();

  const services = page.locator('#services');
  const titles = ['Full branding', 'Logo design', 'Print & packaging', 'Promotional design'];
  await expect(services.locator('.service-card')).toHaveCount(4);
  for (const title of titles) {
    await expect(services.getByRole('heading', { name: title, exact: true }))
      .toBeVisible();
  }
  await expect(services.locator('img')).toHaveCount(0);
  await expect(services).toContainText('Brand identity · Visual direction · Brand applications');
  await expect(services).toContainText('Brochures · Invitations · Packaging · Stationery');
  const desktopCards = await services.locator('.service-card').evaluateAll((cards) =>
    cards.map((card) => ({ top: card.getBoundingClientRect().top, left: card.getBoundingClientRect().left })),
  );
  expect(Math.abs(desktopCards[0].top - desktopCards[1].top)).toBeLessThan(1);
  expect(desktopCards[1].left).toBeGreaterThan(desktopCards[0].left);
  await services.screenshot({
    path: 'test-results/services-desktop.png', animations: 'disabled',
  });
  await page.locator('.nav-contact').click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.getByRole('link', { name: 'Say hello by email' }))
    .toHaveAttribute('href', 'mailto:helfhelm7@gmail.com');
});

test('mobile hero artwork stays visible and text services stack inside the viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const showcase = page.locator('.hero-showcase');
  expect(await showcase.evaluate((element) =>
    getComputedStyle(element).overflowX,
  )).not.toBe('auto');
  for (const preview of await showcase.locator('.showcase-preview').all()) {
    const box = await preview.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(375);
  }
  const eventExample = showcase.getByRole('button', {
    name: 'Open event print project',
  });
  await eventExample.scrollIntoViewIfNeeded();
  await eventExample.click();
  await expect(page.locator('#project-title'))
    .toHaveText('Jemilat & Oluwafemi — Wedding Suite');
  await page.keyboard.press('Escape');
  await expect(eventExample).toBeFocused();
  await page.locator('.hero').screenshot({
    path: 'test-results/hero-mobile.png', animations: 'disabled',
  });
  const services = page.locator('#services');
  await services.scrollIntoViewIfNeeded();
  await expect(services.locator('.service-card')).toHaveCount(4);
  const mobileCards = await services.locator('.service-card').evaluateAll((cards) =>
    cards.map((card) => ({ top: card.getBoundingClientRect().top, left: card.getBoundingClientRect().left })),
  );
  for (let index = 1; index < mobileCards.length; index++) {
    expect(mobileCards[index].top).toBeGreaterThan(mobileCards[index - 1].top);
    expect(Math.abs(mobileCards[index].left - mobileCards[0].left)).toBeLessThan(1);
  }
  await services.screenshot({
    path: 'test-results/services-mobile.png', animations: 'disabled',
  });
  for (const width of [320, 375, 600, 768, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    expect(await page.evaluate(() =>
      document.documentElement.scrollWidth <= innerWidth,
    ), `Overflow at ${width}px`).toBe(true);
  }
  await page.setViewportSize({ width: 375, height: 667 });
  await page.locator('.hero').getByRole('link', {
    name: 'Discuss your project',
  }).click();
  await expect(page).toHaveURL(/#contact$/);
});
