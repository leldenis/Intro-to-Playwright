const { test, expect } = require('@playwright/test');
const RegistrationPage = require('../e2e/auth/registrationPage');

test.describe('User Registration', () => {
  let registrationPage;

  test.beforeEach(async ({ page }) => {
    registrationPage = new RegistrationPage(page);
    await registrationPage.navigate('https://guest:welcome2qauto@qauto.forstudy.space');
    await registrationPage.openRegistrationModal();
  });

  test('should display registration form', async () => {
    await expect(registrationPage.registrationModal).toBeVisible();
  });

  test.describe('Name Field Validations', () => {
    test('should show error for empty name', async () => {
      await registrationPage.nameInput.click();
      await registrationPage.registrationModal.click();
      await registrationPage.verifyErrorMessages(['Name required']);
      await registrationPage.verifyFieldBorderColor(registrationPage.nameInput, 'rgb(220, 53, 69)');
    });

    test('should show error for invalid name', async () => {
      await registrationPage.nameInput.fill('123');
      await registrationPage.registrationModal.click();
      await registrationPage.verifyErrorMessages(['Name is invalid']);
    });
  });

  test('should register successfully with valid data', async ({ page }) => {
    const timestamp = Date.now();
    const testData = {
      name: 'Denys',
      lastName: 'Leliushkin',
      email: `testuser${timestamp}@example.com`,
      password: 'ValidPass1aA',
      repeatPassword: 'ValidPass1aA'
    };

    await registrationPage.fillRegistrationForm(testData);
    await registrationPage.verifyNoErrors();
    await registrationPage.submitRegistration();
    
    await expect(page.locator('h1')).toHaveText('Garage');
  });
});