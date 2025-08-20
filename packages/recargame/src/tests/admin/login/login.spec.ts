import { test, expect } from '@playwright/test';
import AdminLoginPage from '../../../pages/admin/AdminLoginPage';
import { NonExistentUser, Titles } from '../../../constants/index';

test('REC-000001 Login with valid credentials as web administrator', async ({ page }) => {
    const adminLoginPage = new AdminLoginPage(page);
    await adminLoginPage.navigateToAdminLogin();
    await adminLoginPage.loginAsAdmin();
    await expect(adminLoginPage.isLoggedIn()).toBeTruthy();
    await expect(adminLoginPage.alertPopUpTitle).toHaveText(Titles.pleaseWaitPopUp);
    await expect(adminLoginPage.dashboardTitle).toHaveText(Titles.adminDashboard);
});

test('REC-000002 Login with a non existent admin user', async ({ page }) => {
    const adminLoginPage = new AdminLoginPage(page);
    await adminLoginPage.navigateToAdminLogin();
    await adminLoginPage.usernameInput.fill(NonExistentUser.username);
    await adminLoginPage.passwordInput.fill(NonExistentUser.password);
    await adminLoginPage.submitButton.click();
    await expect(adminLoginPage.dashboardTitle).toHaveCount(0);
});
