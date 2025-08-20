"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePage = void 0;
const test_1 = require("@playwright/test");
class BasePage {
    constructor(page) {
        this.page = page;
    }
    async goto(url) {
        await this.page.goto(url);
    }
    async expectUrlContains(partial) {
        await (0, test_1.expect)(this.page).toHaveURL(new RegExp(partial));
    }
}
exports.BasePage = BasePage;
