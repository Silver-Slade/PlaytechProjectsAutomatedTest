"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const baseConfig = (0, test_1.defineConfig)({
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
        { name: 'chromium', use: { ...test_1.devices['Desktop Chrome'] } },
        { name: 'firefox', use: { ...test_1.devices['Desktop Firefox'] } }
    ]
});
exports.default = baseConfig;
