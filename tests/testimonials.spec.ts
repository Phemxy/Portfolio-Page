import { expect, test } from '@playwright/test';

test('client reviews support responsive, keyboard, and touch navigation', async ({
  page,
}) => {
  await page.goto('/#testimonials');
  const section = page.locator('#testimonials');
  const stage = section.locator('.testimonial-stage');
  const count = section.locator('.testimonial-count');
  await expect(section).toBeVisible();
  await expect(section.locator('.testimonial-slot:visible')).toHaveCount(3);
  await expect(section).toContainText('Abatox Global');
  await expect(section).toContainText('Management Team');
  await expect(section).toContainText('Mr. John');
  await expect(section).toContainText('CEO of OK Prints');
  await expect(section).toContainText('Mrs. Jemilat');
  await expect(section).toContainText('Wedding Souvenirs & Event Branding');
  await expect(section).not.toContainText('Placeholder');
  await expect(count).toHaveText('01 / 03');
  await section.screenshot({
    path: 'test-results/testimonials-desktop.png', animations: 'disabled',
  });

  await section.getByRole('button', { name: 'Next testimonial' }).click();
  await expect(count).toHaveText('02 / 03');
  await section.getByRole('button', { name: 'Show testimonial 3' }).click();
  await expect(count).toHaveText('03 / 03');
  await stage.focus();
  await stage.press('ArrowRight');
  await expect(count).toHaveText('01 / 03');
  await expect(stage).toBeFocused();

  await page.setViewportSize({ width: 375, height: 667 });
  await expect(section.locator('.testimonial-slot:visible')).toHaveCount(1);
  await section.screenshot({
    path: 'test-results/testimonials-mobile.png', animations: 'disabled',
  });
  const initialHeight = await stage.evaluate((element) => element.clientHeight);
  await stage.dispatchEvent('pointerdown', {
    pointerType: 'touch', pointerId: 1, clientX: 260, clientY: 300,
  });
  await stage.dispatchEvent('pointerup', {
    pointerType: 'touch', pointerId: 1, clientX: 80, clientY: 300,
  });
  await expect(count).toHaveText('02 / 03');
  const changedHeight = await stage.evaluate((element) => element.clientHeight);
  expect(Math.abs(changedHeight - initialHeight)).toBeLessThanOrEqual(1);
  await section.getByRole('button', { name: 'Previous testimonial' }).click();
  await expect(count).toHaveText('01 / 03');
  await stage.focus();
  await stage.press('End');
  await expect(count).toHaveText('03 / 03');
  await stage.press('Home');
  await expect(count).toHaveText('01 / 03');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(section.locator('.testimonial-slot:visible .testimonial-card'))
    .toHaveCSS('animation-name', 'none');
  await section.getByRole('button', { name: 'Next testimonial' }).click();
  await expect(count).toHaveText('02 / 03');
  expect(await page.evaluate(() =>
    document.documentElement.scrollWidth <= innerWidth,
  )).toBe(true);
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect(page.getByRole('link', { name: 'Say hello by email' }))
    .toHaveAttribute('href', 'mailto:helfhelm7@gmail.com');
  await expect(page.getByRole('link', {
    name: 'Chat on WhatsApp at +234 810 237 3011',
  })).toHaveAttribute('href', 'https://wa.me/2348102373011');
});
