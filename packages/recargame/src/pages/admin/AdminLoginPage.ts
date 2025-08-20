import { Page, Locator } from '@playwright/test';

class AdminLoginPage {
    usernameInput: Locator;
    passwordInput: Locator;
    submitButton: Locator;
    dashboardTitle: Locator;
    alertPopUpContent: Locator;
    alertPopUpTitle: Locator;

  constructor(private page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#txtLogin');
    this.passwordInput = page.locator('#txtClave');
    this.submitButton = page.locator('#btnAutenticar');
    this.dashboardTitle = page.locator('#infoUsuario');
    this.alertPopUpContent = page.locator('#swal2-content');
    this.alertPopUpTitle = page.locator('#swal2-title');
  }

  async navigateToAdminLogin() {
    await this.page.goto(process.env.BASE_URL_ADMIN || '');
  }

  async loginAsAdmin() {
    await this.usernameInput.fill(process.env.USERNAME_ADMIN || '');
    await this.passwordInput.fill(process.env.PASSWORD_ADMIN || '');
    await this.submitButton.click();
  }

  async isLoggedIn() {
    await this.alertPopUpTitle.isVisible();
    await this.alertPopUpContent.isVisible();
    return await this.dashboardTitle.isVisible();
  }
}

export default AdminLoginPage;
