import { expect, test } from '@playwright/test';

const catalog = [
  {
    id: 'sales-by-region',
    queryFragment: 'SUM(o.total_amount)',
    explanation: /joins each order to its customer/i,
  },
  {
    id: 'monthly-revenue',
    queryFragment: "DATE_TRUNC('month'",
    explanation: /calendar months/i,
  },
  {
    id: 'top-customers',
    queryFragment: 'LIMIT 10',
    explanation: /ten highest totals/i,
  },
  {
    id: 'awaiting-fulfillment',
    queryFragment: "awaiting_fulfillment",
    explanation: /awaiting-fulfillment status/i,
  },
  {
    id: 'below-reorder-point',
    queryFragment: 'stock_quantity < reorder_point',
    explanation: /reorder point/i,
  },
];

test.describe('SQL Query Assistant browser workflow', () => {
  test('shows the complete empty shell and is ready within two seconds', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /sql query assistant/i })).toBeVisible();
    await expect(page.getByRole('combobox', { name: /business question/i })).toBeVisible();
    await expect(page.getByTestId('query-panel')).toContainText(/select a business question/i);
    await expect(page.getByTestId('explanation-panel')).toContainText(/select a business question/i);
    await expect(page.getByRole('button', { name: /copy query/i })).toBeDisabled();
    await expect(page.getByRole('combobox', { name: /business question/i }).locator('option')).toHaveCount(6);
    const navigationDuration = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return navigation.domContentLoadedEventEnd - navigation.startTime;
    });
    expect(navigationDuration).toBeLessThan(2_000);
  });

  test('shows the exact query and explanation for all five questions', async ({ page }) => {
    await page.goto('/');
    const selector = page.getByRole('combobox', { name: /business question/i });

    for (const item of catalog) {
      await selector.selectOption(item.id);
      await expect(page.getByTestId('query-code')).toContainText(item.queryFragment);
      await expect(page.getByTestId('explanation-panel')).toContainText(item.explanation);
    }
  });

  test('updates both panels within one hundred milliseconds after selection', async ({ page }) => {
    await page.goto('/');
    const selector = page.getByRole('combobox', { name: /business question/i });
    await selector.selectOption('sales-by-region');

    const elapsed = await page.evaluate(async () => {
      const select = document.querySelector('#business-question') as HTMLSelectElement;
      const queryPanel = document.querySelector('[data-testid="query-code"]') as HTMLElement;
      const start = performance.now();
      await new Promise<void>((resolve) => {
        const observer = new MutationObserver(() => {
          if (queryPanel.textContent?.includes('stock_quantity < reorder_point')) {
            observer.disconnect();
            resolve();
          }
        });
        observer.observe(queryPanel, { childList: true, subtree: true, characterData: true });
        select.value = 'below-reorder-point';
        select.dispatchEvent(new Event('change', { bubbles: true }));
      });
      return performance.now() - start;
    });
    await expect(page.getByTestId('query-code')).toContainText('stock_quantity < reorder_point');

    expect(elapsed).toBeLessThan(100);
  });

  test('supports keyboard selection and clipboard copy with exact text', async ({ browser }) => {
    const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
    const page = await context.newPage();
    await page.goto('/');

    const selector = page.getByRole('combobox', { name: /business question/i });
    await selector.focus();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(selector).toHaveValue('sales-by-region');

    const query = await page.getByTestId('query-code').textContent();
    await page.getByRole('button', { name: /copy query/i }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    await expect(page.getByRole('status')).toContainText(/copied/i);

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toBe(query);
    await context.close();
  });

  test('retains the query and shows failure feedback when copy is denied', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window.navigator, 'clipboard', {
        configurable: true,
        value: { writeText: async () => { throw new Error('Permission denied'); } },
      });
    });
    await page.goto('/');
    await page.getByRole('combobox', { name: /business question/i }).selectOption('monthly-revenue');
    await page.getByRole('button', { name: /copy query/i }).click();

    await expect(page.getByTestId('query-code')).toContainText("DATE_TRUNC('month'");
    await expect(page.getByRole('status')).toContainText(/could not copy/i);
  });
});
