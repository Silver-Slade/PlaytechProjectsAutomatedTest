import { Page } from "@playwright/test";
import AdminLoginPage from "../../pages/admin/AdminLoginPage";

export async function loginAsAdmin(page: Page) {
    const adminLoginPage = new AdminLoginPage(page);
    await adminLoginPage.usernameInput.fill(process.env.USERNAME_ADMIN || '');
    await adminLoginPage.passwordInput.fill(process.env.PASSWORD_ADMIN || '');
    await adminLoginPage.submitButton.click();
}

export async function isLoggedIn(page: Page) {
    const adminLoginPage = new AdminLoginPage(page);
    return await adminLoginPage.dashboardTitle.isVisible();
}
