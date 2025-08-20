import { Page, expect } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}

  async goto(url: string) {
    await this.page.goto(url);
  }

  async expectUrlContains(partial: string) {
    await expect(this.page).toHaveURL(new RegExp(partial));
  }
}
