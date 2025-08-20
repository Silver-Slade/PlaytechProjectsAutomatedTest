import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  timeout: 30_000,
  expect: { timeout: 5_000 },
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    //video: 'retain-on-failure',
    baseURL: process.env.BASE_URL,
    headless: false,
    viewport: { width: 1280, height: 720 }
  },
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } }
  ]
});
