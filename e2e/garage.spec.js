const { expect } = require('@playwright/test');
const { test } = require('./fixtures/garageFixtures');

test('user should see garage page', async ({ userGaragePage }) => {
  await expect(userGaragePage.locator('h1')).toHaveText('Garage');
});
