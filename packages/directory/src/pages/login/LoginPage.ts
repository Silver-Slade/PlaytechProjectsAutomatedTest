import { Page, Locator, expect } from "@playwright/test";
import { Titles, Users } from "../../constants/index";
import HomePage from "../dashboard/HomePage";

class LoginPage {
  usernameInput: Locator;
  passwordInput: Locator;
  submitButton: Locator;
  alertPopUp: Locator;
  alertPopUpTitle: Locator;
  wrongPasswordMessage: Locator;
  fieldRedAlert: Locator;

  constructor(private page: Page) {
    this.page = page;
    this.usernameInput = page.locator("xpath=/html/body/app-root/app-login/main/section[1]/article/form/custom-input[1]/div/div[2]/input");
    this.passwordInput = page.locator("xpath=/html/body/app-root/app-login/main/section[1]/article/form/custom-input[2]/div/div[2]/input");
    this.submitButton = page.getByRole("button", { name: "Entrar" });
    this.alertPopUp = page.locator(".swal2-container");
    this.alertPopUpTitle = page.locator("#swal2-title");
    this.wrongPasswordMessage = page.locator("#swal2-html-container")
    this.fieldRedAlert = page.locator(".text-red-600");
  }

  async navigateToAdminLogin() {
    await this.page.goto(process.env.BASE_URL_ADMIN || "");
  }

  async loginAsAdmin() {
    await this.usernameInput.fill(process.env.USERNAME_ADMIN || "");
    await this.passwordInput.fill(process.env.PASSWORD_ADMIN || "");
    await this.submitButton.click();
  }

  async isLoggedIn(page: Page) {
    const homePage = new HomePage(page);
    await expect(this.alertPopUpTitle).toBeVisible();
    await expect(this.alertPopUp).toBeVisible();
    await expect(this.alertPopUpTitle).toHaveText(Titles.successfulLoginMessage);
    await expect(homePage.dashboardWelcome).toBeVisible({ timeout: 10000 });
    await expect(homePage.dashboardWelcome).toContainText(Titles.welcomeMessage + Users.admin.name);
    await expect(homePage.dashboardTitle).toBeVisible();
    await expect(homePage.dashboardTitle).toHaveText(Titles.dashboardTitle);
    await expect(homePage.dashboardAvatarImage).toBeVisible();

    // por ahora acá, pensar en migrar a una función  de HomePage que valide las cards y utilizarla acá
    const createCampaingCard = homePage.cardAt(0);
    const creaetEventCard = homePage.cardAt(1);
    const createStrategyCard = homePage.cardAt(2);
    const myRegistersCard = homePage.cardAt(3);
    const myCampaingsCard = homePage.cardAt(4);
    const myEventsCard = homePage.cardAt(5);
    const myStrategyCard = homePage.cardAt(6);
    const reportsCard = homePage.cardAt(7);

    await expect(createCampaingCard).toBeVisible();
    await expect(creaetEventCard).toBeVisible();
    await expect(createStrategyCard).toBeVisible();
    await expect(myRegistersCard).toBeVisible();
    await expect(myCampaingsCard).toBeVisible();
    await expect(myEventsCard).toBeVisible();
    await expect(myStrategyCard).toBeVisible();
    await expect(reportsCard).toBeVisible();
    await expect(homePage.dashboardCards).toHaveCount(8);
    await expect(createCampaingCard.getByRole('heading', { level: 2 })).toHaveText('Crear campaña');
    await expect(creaetEventCard.getByRole('heading', { level: 2 })).toHaveText('Crear evento');
    await expect(createStrategyCard.getByRole('heading', { level: 2 })).toHaveText('Crear estrategia');
    await expect(myRegistersCard.getByRole('heading', { level: 2 })).toHaveText('Mis registros');
    await expect(myCampaingsCard.getByRole('heading', { level: 2 })).toHaveText('Mis campañas');
    await expect(myEventsCard.getByRole('heading', { level: 2 })).toHaveText('Mis eventos');
    await expect(myStrategyCard.getByRole('heading', { level: 2 })).toHaveText('Mis estrategias');
    await expect(reportsCard.getByRole('heading', { level: 2 })).toHaveText('Ver reportes');
  }
}

export default LoginPage;
