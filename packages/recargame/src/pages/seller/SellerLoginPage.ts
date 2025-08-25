import { Page, Locator, expect } from "@playwright/test";

class SellerLoginPage {
  usernameInput: Locator;
  passwordInput: Locator;
  submitButton: Locator;
  dashboardTitle: Locator;
  alertPopUpContent: Locator;
  alertPopUpTitle: Locator;
  dashboardImage: Locator;

  constructor(private page: Page) {
    this.page = page;
    this.usernameInput = page.locator("#txtLogin");
    this.passwordInput = page.locator("#txtClave");
    this.submitButton = page.locator("#btnAutenticar");
    this.dashboardTitle = page.locator(".ui-dialog-titlebar");
    this.alertPopUpContent = page.locator("#swal2-content");
    this.alertPopUpTitle = page.locator("#swal2-title");
    this.dashboardImage = page.locator('xpath=//*[@id="bannerMenu"]');
  }

  async navigateToSellerLogin() {
    await this.page.goto(process.env.BASE_URL_SELLER || "");
  }

  async loginAsSeller() {
    await this.usernameInput.fill(process.env.USERNAME_SELLER || "");
    await this.passwordInput.fill(process.env.PASSWORD_SELLER || "");
    await this.submitButton.click();
  }

  async isLoggedIn() {
    await expect(this.alertPopUpTitle).toBeVisible();
    await expect(this.alertPopUpContent).toBeVisible();
    await expect(this.dashboardImage).toBeHidden();
    await expect(this.dashboardTitle).toBeHidden();
  }
}

export default SellerLoginPage;
