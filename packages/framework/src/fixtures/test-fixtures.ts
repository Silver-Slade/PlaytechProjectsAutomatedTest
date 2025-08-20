import { test as base, Page } from '@playwright/test';

export type TestFixtures = {
  page: Page;
};

export const test = base.extend<TestFixtures>({});
export const expect = base.expect;
