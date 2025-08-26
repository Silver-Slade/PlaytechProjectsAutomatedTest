import { Page, Locator, expect } from "@playwright/test";

class AdminLoginPage {
  usernameInput: Locator;
  passwordInput: Locator;
  submitButton: Locator;
  dashboardTitle: Locator;
  alertPopUpContent: Locator;
  alertPopUpTitle: Locator;
  dashboardImage: Locator;
  userOption: Locator;

  constructor(private page: Page) {
    this.page = page;
    this.usernameInput = page.locator("#txtLogin");
    this.passwordInput = page.locator("#txtClave");
    this.submitButton = page.locator("#btnAutenticar");
    this.dashboardTitle = page.locator("#titulo-rol");
    this.alertPopUpContent = page.locator("#swal2-content");
    this.alertPopUpTitle = page.locator("#swal2-title");
    this.dashboardImage = page.locator('xpath=//*[@id="bannerMenu"]');
    this.userOption = page.locator("#infoUsuario");
  }

  async navigateToAdminLogin() {
    await this.page.goto(process.env.BASE_URL_ADMIN || "");
  }

  async loginAsAdmin() {
    await this.usernameInput.fill(process.env.USERNAME_ADMIN || "");
    await this.passwordInput.fill(process.env.PASSWORD_ADMIN || "");
    await this.submitButton.click();
  }

  async isLoggedIn() {
    await expect(this.alertPopUpTitle).toBeVisible();
    await expect(this.alertPopUpContent).toBeVisible();
    await expect(this.dashboardImage).toBeHidden();
    await expect(this.userOption).toBeHidden();
    await expect(this.dashboardTitle).toBeHidden();
  }
}

export default AdminLoginPage;