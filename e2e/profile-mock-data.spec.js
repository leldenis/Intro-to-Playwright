import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
import fs from 'fs'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

dotenv.config({ path: path.resolve(__dirname, '../.env') }); 

test.describe('Profile Page Data Mocking', () => {
  const mockedProfileResponse = {
    status: "ok",
    data: {
      userId: 777,
      photoFilename: "mock-user-avatar.png",
      name: "ТестовеІм'я", 
      lastName: "ТестовеПрізвище", 
    }
  };

  let context;
  let page;

  test.beforeEach(async ({ browser }) => {
    const storageStatePath = path.resolve(__dirname, 'auth/storageState.json'); 
    
    if (!fs.existsSync(storageStatePath)) {
      throw new Error(`storageState.json not found at ${storageStatePath}. Please run 'node e2e/auth/loginSetup.js' first.`);
    }
    
    const storageStateContent = JSON.parse(fs.readFileSync(storageStatePath, 'utf-8'));
    
    context = await browser.newContext({ storageState: storageStateContent });
    page = await context.newPage();

    await page.route('**/api/users/profile', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockedProfileResponse),
      });
    });

    await page.goto(`${process.env.BASE_URL}/panel/profile`); 

    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveURL(`${process.env.BASE_URL}/panel/profile`);
    await expect(page.locator('h1')).toHaveText('Profile'); 
  });

  test.afterEach(async () => {
    if (context) {
      await context.close();
    }
  });

  test('should display mocked user profile data (name and last name) on the page', async () => {
 
    const fullNameElement = page.locator('p.profile_name'); 

    await expect(fullNameElement).toHaveText(`${mockedProfileResponse.data.name} ${mockedProfileResponse.data.lastName}`);
  });
});