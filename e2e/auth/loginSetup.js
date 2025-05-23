const { chromium } = require('@playwright/test');
require('dotenv').config();

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    httpCredentials: {
      username: process.env.BASIC_AUTH_USER,
      password: process.env.BASIC_AUTH_PASS
    }
  });
  const page = await context.newPage();

  await page.goto(process.env.BASE_URL);
  await page.locator('button:has-text("Sign In")').count();

  await page.locator('button:has-text("Sign In")').click();
  await page.fill('#signinEmail', process.env.USER_EMAIL);
  await page.fill('#signinPassword', process.env.USER_PASS);
  await page.locator('button:has-text("Login")').click();

  await page.waitForURL('**/panel/garage');
  await context.storageState({ path: 'e2e/.auth/storageState.json' });

  await browser.close();
})();
