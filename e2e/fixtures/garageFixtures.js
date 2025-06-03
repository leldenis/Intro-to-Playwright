import { test as base } from '@playwright/test';

export const test = base.test.extend({
  userGaragePage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'e2e/auth/storageState.json'
    });
    const page = await context.newPage();
    await page.goto('/panel/garage');
    await use(page);
    await context.close();
  }
});