const { expect } = require('@playwright/test');
const BasePage = require('../pages/basePage');

class RegistrationPage extends BasePage {
  constructor(page) {
    super(page);

    this.signUpButton = page.locator('button', { hasText: 'Sign up' });
    this.registrationModal = page.locator('.modal-dialog');
    this.nameInput = page.locator('#signupName');
    this.lastNameInput = page.locator('#signupLastName');
    this.emailInput = page.locator('#signupEmail');
    this.passwordInput = page.locator('#signupPassword');
    this.repeatPasswordInput = page.locator('#signupRepeatPassword');
    this.registerButton = page.locator('button', { hasText: 'Register' });
    this.errorMessages = page.locator('.invalid-feedback');
  }

  async openRegistrationModal() {
    await this.signUpButton.waitFor({ state: 'visible' });
    await this.signUpButton.click();
    await this.registrationModal.waitFor({ state: 'visible' });
    await expect(this.registrationModal).toBeVisible();
  }

  async fillRegistrationForm(data) {
    await this.nameInput.waitFor({ state: 'visible' });
    await this.nameInput.fill(data.name);
    await this.lastNameInput.fill(data.lastName);
    await this.emailInput.fill(data.email);
    await this.passwordInput.fill(data.password);
    await this.repeatPasswordInput.fill(data.repeatPassword);
  }

  async submitRegistration() {
    await this.registerButton.waitFor({ state: 'visible' });
    await this.registerButton.click();
  }

  async verifyNoErrors() {
    await expect(this.errorMessages).toHaveCount(0);
  }

  async verifyErrorMessages(messages) {
    for (const message of messages) {
      await expect(this.errorMessages.filter({ hasText: message })).toBeVisible();
    }
  }

  async verifyFieldBorderColor(field, expectedColor) {
    await field.waitFor({ state: 'visible' });
    await expect(field).toHaveCSS('border-color', expectedColor);
  }
}

module.exports = RegistrationPage;
