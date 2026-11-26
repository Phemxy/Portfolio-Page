import { expect, test } from '@playwright/test';

test('clean logo and reference responsive breakpoints fit phone through desktop', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const logo = page.locator('.site-header .brand img');
  await expect(logo).toHaveAttribute('src', /phemxy-logo-clean\.png$/);
  await expect.poll(() => logo.evaluate((element) =>
    (element as HTMLImageElement).naturalWidth,
  )).toBeGreaterThan(0);
  const pixels = await logo.evaluate((element) => {
    const image = element as HTMLImageElement;
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext('2d')!;
    context.drawImage(image, 0, 0);
    const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let nearWhite = 0;
    let transparent = 0;
    for (let index = 0; index < data.length; index += 4) {
      if (data[index + 3] === 0) transparent++;
      if (data[index + 3] >= 48 && data[index] >= 200 &&
          data[index + 1] >= 200 && data[index + 2] >= 200) nearWhite++;
    }
    return { nearWhite, transparent, width: canvas.width, height: canvas.height };
  });
  expect(pixels.nearWhite, 'Visible white matte pixels remain in the logo').toBe(0);
  expect(pixels.transparent).toBeGreaterThan(0);

  for (const width of [320, 375, 600, 601, 768, 800, 801, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const menu = page.getByRole('button', { name: /Menu/ });
    if (width <= 800) await expect(menu).toBeVisible();
    else await expect(menu).toBeHidden();
    const size = await logo.boundingBox();
    expect(size!.width).toBeLessThan(width <= 800 ? 145 : 185);
    expect(pixels.width).toBeGreaterThanOrEqual(size!.width * 2);
    expect(pixels.height).toBeGreaterThanOrEqual(size!.height * 2);
    const columns = await page.evaluate(() => {
      const count = (selector: string) =>
        getComputedStyle(document.querySelector(selector)!).gridTemplateColumns.split(' ').length;
      return { projects: count('.projects'), services: count('.service-grid'), about: count('.about') };
    });
    expect(columns.projects).toBe(width <= 600 ? 1 : width <= 800 ? 2 : 3);
    expect(columns.services).toBe(width <= 600 ? 1 : 2);
    expect(columns.about).toBe(width <= 600 ? 1 : 2);
    for (const preview of await page.locator('.showcase-preview').all()) {
      const box = await preview.boundingBox();
      expect(box!.x, `Artwork clipped at ${width}px`).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width, `Artwork clipped at ${width}px`)
        .toBeLessThanOrEqual(width);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      `Page overflow at ${width}px`).toBe(true);
  }
  await page.locator('.site-header').screenshot({
    path: 'test-results/clean-logo-desktop.png', animations: 'disabled',
  });

  await page.route(/http:\/\/127\.0\.0\.1:4173\/resources\/phemxy-logo-clean\.png$/,
    (route) => route.abort());
  await page.reload();
  await expect(logo).toHaveAttribute('src',
    /raw\.githubusercontent\.com.*3a16e68b70ff95a0597f5b4071fa4e5883359fc9.*phemxy-logo-clean\.png$/);
  await expect.poll(() => logo.evaluate((element) =>
    (element as HTMLImageElement).naturalWidth,
  )).toBeGreaterThan(0);
});
