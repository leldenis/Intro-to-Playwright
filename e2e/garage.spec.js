import { expect } from '@playwright/test';
import { test } from './fixtures/garageFixtures.js';

test('user should see garage page', async ({ userGaragePage }) => {
  await expect(userGaragePage.locator('h1')).toHaveText('Garage');
});