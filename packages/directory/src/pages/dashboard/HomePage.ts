import { Page, Locator, expect } from "@playwright/test";
import { Titles, Users } from "../../constants/index";

class HomePage {
  dashboardTitle: Locator;
  dashboardWelcome: Locator;
  dashboardAvatarImage: Locator;
  userOption: Locator;
  dashboardCards: Locator;

  constructor(private page: Page) {
    this.page = page;
    this.dashboardWelcome = page.locator(".color-secondary");
    this.dashboardTitle = page.getByText(Titles.dashboardTitle);
    this.dashboardAvatarImage = page.getByRole('banner').locator('p-avatar');
    this.userOption = page.locator("#infoUsuario");
    this.dashboardCards = page.locator('article[tabindex="0"]');
  }

   cardAt(i: number): Locator {
    return this.dashboardCards.nth(i);
   }
}

export default HomePage;
