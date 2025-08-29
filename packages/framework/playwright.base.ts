import { defineConfig, devices } from '@playwright/test';

const baseConfig = defineConfig({
  timeout: 30_000,
  expect: { timeout: 10_000 },
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    //video: 'retain-on-failure',
    headless: true,
    viewport: { width: 1280, height: 720 }
  }
});

export default baseConfig;
