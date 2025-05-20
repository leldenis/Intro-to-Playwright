
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests', // де знаходяться тести
  fullyParallel: true, // запускати тести паралельно
  forbidOnly: !!process.env.CI, // заборонити test.only на CI
  retries: process.env.CI ? 2 : 0, // ретраї на CI
  workers: process.env.CI ? 1 : undefined, // кількість воркерів
  reporter: 'html', // репортер
  use: {
    baseURL: 'https://your-test-site.com', // базова URL
    trace: 'on-first-retry', // трейси для дебагу
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});