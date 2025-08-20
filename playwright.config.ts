import { defineConfig } from '@playwright/test';
import recConfig from './packages/recargame/playwright.config';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, 'packages/recargame/.env') });

const projects = recConfig.projects?.map(p => ({
  ...p,
  testDir: p.testDir
    ? path.resolve(__dirname, 'packages/recargame', p.testDir)
    : p.testDir
}));

export default defineConfig({
  ...recConfig,
  projects,
});
