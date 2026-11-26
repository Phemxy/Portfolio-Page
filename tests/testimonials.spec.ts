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

test('testimonials stay readable through tablet widths and desktop transitions', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto('/#testimonials');
  const section = page.locator('#testimonials');
  const stage = section.locator('.testimonial-stage');
  const count = section.locator('.testimonial-count');
  const next = section.getByRole('button', { name: 'Next testimonial' });
  for (const width of [320, 375, 600, 700, 768, 900, 1024, 1100, 1101, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const compact = width <= 1100;
    await expect(section.locator('.testimonial-cards'))
      .toHaveAttribute('data-compact', String(compact));
    const visible = section.locator('.testimonial-slot:visible');
    await expect(visible).toHaveCount(compact ? 1 : 3);
    const boxes = await visible.locator('.testimonial-card').evaluateAll((cards) =>
      cards.map((card) => {
        const rect = card.getBoundingClientRect();
        const quote = card.querySelector('blockquote')!;
        return {
          left: rect.left, right: rect.right, width: rect.width,
          quoteWidth: quote.clientWidth,
          contentFits: card.scrollHeight <= card.clientHeight + 1 &&
            quote.scrollWidth <= quote.clientWidth,
        };
      }),
    );
    for (const box of boxes) {
      expect(box.left, `Card clipped on left at ${width}px`).toBeGreaterThanOrEqual(0);
      expect(box.right, `Card clipped on right at ${width}px`).toBeLessThanOrEqual(width);
      expect(box.contentFits, `Quote clipped at ${width}px`).toBe(true);
    }
    if (compact) {
      expect(boxes[0].width, `Narrow card at ${width}px`)
        .toBeGreaterThanOrEqual(Math.min(560, width * 0.75));
      expect(boxes[0].quoteWidth, `Narrow quote at ${width}px`)
        .toBeGreaterThanOrEqual(Math.min(420, width * 0.55));
      const initialHeight = await stage.evaluate((element) => element.clientHeight);
      for (let review = 0; review < 3; review++) {
        await next.click();
        const height = await stage.evaluate((element) => element.clientHeight);
        expect(Math.abs(height - initialHeight), `Layout jump at ${width}px`)
          .toBeLessThanOrEqual(1);
      }
      await expect(count).toHaveText('01 / 03');
    } else {
      expect(boxes[0].right, `Cards overlap at ${width}px`).toBeLessThanOrEqual(boxes[1].left + 1);
      expect(boxes[1].right, `Cards overlap at ${width}px`).toBeLessThanOrEqual(boxes[2].left + 1);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      `Page overflow at ${width}px`).toBe(true);
    for (const control of await section.locator('.testimonial-controls button').all()) {
      const size = await control.boundingBox();
      expect(size?.width).toBeGreaterThanOrEqual(44);
      expect(size?.height).toBeGreaterThanOrEqual(44);
    }
    if (width === 768) {
      await section.screenshot({
        path: 'test-results/testimonials-tablet.png', animations: 'disabled',
      });
    }
  }
});
