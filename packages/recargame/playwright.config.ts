import baseConfig from '@qa/framework/playwright.base';
import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  ...baseConfig,
  testDir: 'src/tests',
  use: {
    ...baseConfig.use
  },
  projects: [
    {
      name: 'admin',
      testDir: 'src/tests/admin',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.BASE_URL_ADMIN
      }
    },
    {
      name: 'seller',
      testDir: 'src/tests/seller',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.BASE_URL_SELLER
      }
    }
  ]
});
