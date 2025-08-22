import { Page } from '@playwright/test';
export type TestFixtures = {
    page: Page;
};
export declare const test: import("@playwright/test").TestType<import("@playwright/test").PlaywrightTestArgs & import("@playwright/test").PlaywrightTestOptions & TestFixtures, import("@playwright/test").PlaywrightWorkerArgs & import("@playwright/test").PlaywrightWorkerOptions>;
export declare const expect: import("@playwright/test").Expect<{}>;
