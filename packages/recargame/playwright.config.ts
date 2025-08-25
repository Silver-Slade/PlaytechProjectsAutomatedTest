import { baseConfig } from '@qa/framework';
import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  ...baseConfig,
  use: {
    ...baseConfig.use
  },
  projects: [
    {
      name: 'admin',
      testDir: path.join(__dirname, 'src', 'tests', 'admin'),
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.BASE_URL_ADMIN
      }
    },
    {
      name: 'seller',
      testDir: path.join(__dirname, 'src', 'tests', 'seller'),
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.BASE_URL_SELLER
      }
    }
  ],
  reporter: [
    ['junit', { outputFile: path.join(__dirname, 'test-results', 'results.xml') }],
    ['html',  { outputFolder: path.join(__dirname, 'playwright-report'), open: 'never' }]
  ]
});
