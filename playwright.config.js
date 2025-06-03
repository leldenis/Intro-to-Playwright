import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config'; 

export default defineConfig({ 
  testDir: './e2e',
  testMatch: '**/*.spec.js',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  globalSetup: './e2e/auth/globalSetup.js',

  use: {
    baseURL: process.env.BASE_URL,
    httpCredentials: {
      username: process.env.BASIC_AUTH_USER,
      password: process.env.BASIC_AUTH_PASS
    },
    trace: 'on-first-retry',
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