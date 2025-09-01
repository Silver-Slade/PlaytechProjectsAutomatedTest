import { Page, Locator, expect } from "@playwright/test";
import HomePage  from "./HomePage"

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
    await this.usernameInput.fill(process.env.USERNAME_SUPERADMIN || "");
    await this.passwordInput.fill(process.env.PASSWORD_SUPERADMIN || "");
    await this.submitButton.click();
  }

  async isLoggedIn(page: Page) {
    const homePage = new HomePage(page);
    await expect(homePage.loteriasCard).toBeVisible();
    await expect(homePage.premiosCard).toBeVisible();
    await expect(homePage.netoLoteriaCard).toBeVisible();
    await expect(homePage.otrosProductosCard).toBeVisible();
    await expect(homePage.resultadoFinalCard).toBeVisible();
    await expect(homePage.balanceOtrosProductosCard).toBeVisible();
    await expect(homePage.tablaDeResultados).toBeVisible();
    await expect(homePage.loteriasCard).toContainText("Loterías");
    await expect(homePage.premiosCard).toContainText("Premios");
    await expect(homePage.netoLoteriaCard).toContainText("Neto lotería");
    await expect(homePage.otrosProductosCard).toContainText("Otros productos");
    await expect(homePage.resultadoFinalCard).toContainText("Resultado final");
    await expect(homePage.balanceOtrosProductosCard).toContainText("Balance otros productos");
  }
}

export default AdminLoginPage;