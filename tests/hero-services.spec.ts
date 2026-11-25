import { expect, test } from '@playwright/test';

test('hero examples and visual services lead to projects and enquiries', async ({
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
  const expected = [
    ['Brand identity & logos', 'Blinders Cut — Brand Identity'],
    ['Packaging design', 'Gellas Food — Plantain Chips'],
    ['Print & branded merchandise', 'Westerham — Branded T-Shirts'],
    ['Event branding & souvenirs', 'Jemilat & Oluwafemi — Wedding Suite'],
  ];
  await expect(services.locator('.service-card')).toHaveCount(4);
  for (const [name, projectTitle] of expected) {
    const card = services.locator('.service-card').filter({
      has: page.getByRole('heading', { name, exact: true }),
    });
    await card.scrollIntoViewIfNeeded();
    const preview = card.getByRole('button', { name: /View example of/ });
    await preview.click();
    await expect(page.locator('#project-title')).toHaveText(projectTitle);
    await page.keyboard.press('Escape');
    await expect(preview).toBeFocused();
    await expect(card.getByRole('link', { name: /Discuss this service:/ }))
      .toHaveAttribute('href', '#contact');
  }
  await services.screenshot({
    path: 'test-results/services-desktop.png', animations: 'disabled',
  });
  await page.locator('#service-events')
    .getByRole('link', { name: /Discuss this service:/ }).click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.getByRole('link', { name: 'Say hello by email' }))
    .toHaveAttribute('href', 'mailto:helfhelm7@gmail.com');
});

test('mobile hero scrolls internally and service artwork stays inside the viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const showcase = page.locator('.hero-showcase');
  expect(await showcase.evaluate((element) =>
    element.scrollWidth > element.clientWidth,
  )).toBe(true);
  const eventExample = showcase.getByRole('button', {
    name: 'Open event print project',
  });
  await eventExample.scrollIntoViewIfNeeded();
  await eventExample.click();
  await expect(page.locator('#project-title'))
    .toHaveText('Jemilat & Oluwafemi — Wedding Suite');
  await page.keyboard.press('Escape');
  await expect(eventExample).toBeFocused();
  await showcase.evaluate((element) => { element.scrollLeft = 0; });
  await page.locator('.hero').screenshot({
    path: 'test-results/hero-mobile.png', animations: 'disabled',
  });
  const services = page.locator('#services');
  for (const card of await services.locator('.service-card').all()) {
    await card.scrollIntoViewIfNeeded();
    const image = card.locator('.service-visual img');
    await expect.poll(() => image.evaluate((element) =>
      (element as HTMLImageElement).naturalWidth,
    )).toBeGreaterThan(0);
    await expect(image).toHaveCSS('object-fit', 'contain');
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
