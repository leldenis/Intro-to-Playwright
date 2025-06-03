import { chromium } from '@playwright/test';
import 'dotenv/config';

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 100 }); 
  const context = await browser.newContext({
      httpCredentials: { 
      username: process.env.BASIC_AUTH_USER,
      password: process.env.BASIC_AUTH_PASS
    }
  });
  const page = await context.newPage();

  await page.goto(process.env.BASE_URL);
  await page.waitForLoadState('networkidle'); 

  const signInButton = page.locator('button:has-text("Sign In")');
  try {
    await signInButton.waitFor({ state: 'visible', timeout: 10000 });
    await signInButton.click();
    await page.waitForLoadState('domcontentloaded');
  } catch (error) {
    console.error('Помилка: Кнопка "Sign In" не знайдена або не клікабельна.');
    await page.screenshot({ path: 'debug_signin_button_error.png' });
    await browser.close();
    process.exit(1);
  }

  try {
    await page.fill('#signinEmail', process.env.USER_EMAIL);
    await page.fill('#signinPassword', process.env.USER_PASS);
  } catch (error) {
    console.error('Помилка: Поля email/password не знайдені або не заповнюються.');
    await page.screenshot({ path: 'debug_fill_form_error.png' });
    await browser.close();
    process.exit(1);
  }
  
  const loginButton = page.locator('button:has-text("Login")');
  try {
    await loginButton.waitFor({ state: 'visible', timeout: 10000 });
    await loginButton.click();
  } catch (error) {
    console.error('Помилка: Кнопка "Login" не знайдена або не клікабельна.');
    await page.screenshot({ path: 'debug_login_button_error.png' });
    await browser.close();
    process.exit(1);
  }

  try {
    console.log('7. Чекаємо URL "/panel/garage" або "/panel/profile" після логіну...');
    await page.waitForURL((url) => url.pathname.startsWith('/panel/garage') || url.pathname.startsWith('/panel/profile'), { timeout: 15000 });
  } catch (error) {
    console.error('Помилка: Не вдалося перейти на очікуваний URL після логіну.');
    console.error('Поточний URL після кліку "Login":', page.url());
    console.error('Можливо, логін не вдався або редирект веде на іншу сторінку.');
    await page.screenshot({ path: 'debug_post_login_redirect_error.png' });
    await browser.close();
    process.exit(1);
  }

  await context.storageState({ path: 'e2e/auth/storageState.json' });
  console.log('storageState.json успішно збережено!');

  await browser.close();
  console.log('Браузер закрито.');
})();