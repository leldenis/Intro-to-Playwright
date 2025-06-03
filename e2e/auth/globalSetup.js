import { chromium } from '@playwright/test';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storageStatePath = path.resolve(__dirname, 'storageState.json');

async function globalSetup() {
  console.log('\nStarting global setup: Logging in and saving storageState.json...');

  const browser = await chromium.launch();
  const context = await browser.newContext({
    httpCredentials: { 
      username: process.env.BASIC_AUTH_USER,
      password: process.env.BASIC_AUTH_PASS
    }
  });
  const page = await context.newPage();

  try {
    await page.goto(`${process.env.BASE_URL}`);
    
    const signInButton = page.locator('button:has-text("Sign In")');
    await signInButton.waitFor({ state: 'visible', timeout: 10000 });
    await signInButton.click();
    await page.waitForLoadState('domcontentloaded');

    await page.fill('#signinEmail', process.env.USER_EMAIL);
    await page.fill('#signinPassword', process.env.USER_PASS);
    
    const loginButton = page.locator('button:has-text("Login")');
    await loginButton.waitFor({ state: 'visible', timeout: 10000 });
    await loginButton.click();

    await page.waitForURL((url) => url.pathname.startsWith('/panel/garage') || url.pathname.startsWith('/panel/profile'), { timeout: 15000 });
    
    await context.storageState({ path: storageStatePath });
    console.log(`storageState.json saved successfully at: ${storageStatePath}`);

  } catch (error) {
    console.error('ERROR during global setup (login failed):', error);
    if (page) {
      await page.screenshot({ path: 'global_setup_login_failure.png' });
      console.log('Screenshot saved to global_setup_login_failure.png');
    }
    await browser.close();
    throw new Error('Global setup failed: Could not log in and save storage state.');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  console.log('Global setup finished.');
}

export default globalSetup;