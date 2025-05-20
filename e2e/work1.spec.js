import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('https://guest:welcome2qauto@qauto.forstudy.space');
    await page.getByRole('button', { name: 'Sign up' }).click();
});

test.describe('Title Verification', () => {
    test('should display the pop-up title', async ({ page }) => {
        await expect(page.locator('.modal-title')).toHaveText('Registration');
        await expect(page.locator('.modal-title')).toBeVisible();
    });
});

test.describe('Name Field Validations', () => {
    test('should display the "Name" label as visible', async ({ page }) => {
        await expect(page.getByText('Name', { exact: true })).toBeVisible();
    });

    test('should display an error "Name required" if field is empty', async ({ page }) => {
        await page.locator('#signupName').click();
        await page.locator('.modal-header').click();
        await expect(page.locator('.invalid-feedback')).toBeVisible();
        await expect(page.locator('.invalid-feedback')).toContainText('Name required');
    });

    test('should display an error "Name is invalid"', async ({ page }) => {
        await page.locator('#signupName').fill('3');
        await page.locator('.modal-header').click();
        await expect(page.locator('.invalid-feedback')).toContainText('Name is invalid');
        
        await page.locator('#signupName').fill(' John Doe ');
        await expect(page.locator('.invalid-feedback')).toContainText('Name is invalid');
    });

    test('should display an error about length when 1 symbol', async ({ page }) => {
        await page.locator('#signupName').fill('3');
        await page.locator('.modal-header').click();
        await expect(page.locator('.invalid-feedback')).toContainText('Name has to be from 2 to 20 characters long');
    });

    test('should display an error about length when 22 symbols', async ({ page }) => {
        await page.locator('#signupName').fill('2222222222333333333311');
        await page.locator('.modal-header').click();
        await expect(page.locator('.invalid-feedback')).toContainText('Name has to be from 2 to 20 characters long');
    });

    test('should display border color red when have an error', async ({ page }) => {
        await page.locator('#signupName').fill('3');
        await page.locator('.modal-header').click();
        await expect(page.locator('#signupName')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    });
});

test.describe('Last name Field Validations', () => {
    test('should display the "Last name" label as visible', async ({ page }) => {
        await expect(page.getByText('Last name', { exact: true })).toBeVisible();
    });

    test('should display an error "Last name required" if field is empty', async ({ page }) => {
        await page.locator('#signupLastName').click();
        await page.locator('.modal-header').click();
        await expect(page.locator('.invalid-feedback')).toContainText('Last name required');
    });

    test('should display an error "Last name is invalid"', async ({ page }) => {
        await page.locator('#signupLastName').fill('3');
        await page.locator('.modal-header').click();
        await expect(page.locator('.invalid-feedback')).toContainText('Last name is invalid');
        
        await page.locator('#signupLastName').fill(' John Doe ');
        await expect(page.locator('.invalid-feedback')).toContainText('Last name is invalid');
    });

    test('should display border color red when have an error', async ({ page }) => {
        await page.locator('#signupLastName').fill('3');
        await page.locator('.modal-header').click();
        await expect(page.locator('#signupLastName')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    });
});

test.describe('Email Field Validations', () => {
    test('should display the "Email" label as visible', async ({ page }) => {
        await expect(page.locator('.form-group').filter({ hasText: 'Email' })).toBeVisible();
    });

    test('should display an error if the "Email" field is empty', async ({ page }) => {
        await page.locator('#signupEmail').click();
        await page.locator('.modal-header').click();
        await expect(page.locator('.invalid-feedback')).toContainText('Email required');
    });

    test('should display an error for an invalid email format', async ({ page }) => {
        await page.locator('#signupEmail').fill('invalid-email');
        await page.locator('.modal-header').click();
        await expect(page.locator('.invalid-feedback')).toContainText('Email is incorrect');
    });

    test('should display border color red when have an error', async ({ page }) => {
        await page.locator('#signupEmail').fill('3');
        await page.locator('.modal-header').click();
        await expect(page.locator('#signupEmail')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    });
});

test.describe('Password Field Validation', () => {
    test('should display the "Password" label as visible', async ({ page }) => {
        await expect(page.getByText('Password', { exact: true })).toBeVisible();
    });

    test('should display an error if the "Password" field is empty', async ({ page }) => {
        await page.locator('#signupPassword').click();
        await page.locator('.modal-header').click();
        await expect(page.locator('.invalid-feedback')).toContainText('Password required');
    });

    test('should display an error for a password shorter than 8 characters', async ({ page }) => {
        await page.locator('#signupPassword').fill('Short1');
        await page.locator('.modal-header').click();
        await expect(page.locator('.invalid-feedback')).toContainText(
            'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter');
    });

    test('should display an error for a password without requirements', async ({ page }) => {
        await page.locator('#signupPassword').fill('NoIntegersA');
        await page.locator('.modal-header').click();
        await expect(page.locator('.invalid-feedback')).toContainText(
            'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter');
        await page.locator('#signupPassword').fill('nocapital1');
        await expect(page.locator('.invalid-feedback')).toContainText(
            'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter');
        await page.locator('#signupPassword').fill('NOLOWERCASE1');
        await expect(page.locator('.invalid-feedback')).toContainText(
            'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter');
    });
});

test.describe('Re-enter Password Field Validation', () => {
    test('should display the "Re-enter password" label as visible', async ({ page }) => {
        await expect(page.locator('.form-group').filter({ hasText: 'Re-enter password' })).toBeVisible();
    });

    test('should display error when passwords do not match', async ({ page }) => {
        await page.locator('#signupPassword').fill('ValidPass1aA');
        await page.locator('#signupRepeatPassword').fill('DiffPass2bB');
        await page.locator('.modal-header').click();
        await expect(page.locator('.invalid-feedback')).toContainText('Passwords do not match');
        await expect(page.locator('#signupRepeatPassword')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    });
});

test.describe('Register Button Verification', () => {
    test('should have "Register" button disabled with invalid data', async ({ page }) => {
        await page.locator('#signupName').fill('Denys');
        await page.locator('#signupLastName').fill('Leliushkin');
        await page.locator('#signupEmail').fill('cineversehubb@gmail.com');
        await page.locator('#signupPassword').fill('ValidPass1aA');
        await page.locator('#signupRepeatPassword').fill('DiffPass2bB');
        await expect(page.getByRole('button', { name: 'Register' })).toBeDisabled();
    });
});

test.describe('Successful Registration and Login', () => {
    test('should register successfully with valid data', async ({ page }) => {
        const timestamp = Date.now();
        const email = `testuser${timestamp}@example.com`;
        const password = 'ValidPass1aA';

        await page.locator('#signupName').fill('Denys');
        await page.locator('#signupLastName').fill('Leliushkin');
        await page.locator('#signupEmail').fill(email);
        await page.locator('#signupPassword').fill(password);
        await page.locator('#signupRepeatPassword').fill(password);
        
        await expect(page.locator('.invalid-feedback')).toHaveCount(0);
        await expect(page.getByRole('button', { name: 'Register' })).toBeEnabled();
        
        await page.getByRole('button', { name: 'Register' }).click();
        await expect(page.getByRole('heading', { name: 'Garage' })).toBeVisible();
    });
});