import { test, expect } from '@playwright/test';
import LoginPage from '../../../pages/login/LoginPage';
import { NonExistentUser, Titles, Users } from '../../../constants/index';

test('DIR-000001 Login with valid credentials as web administrator', async ({ page }) => {
    const adminLoginPage = new LoginPage(page);
    await adminLoginPage.navigateToAdminLogin();
    await adminLoginPage.loginAsAdmin();
    await adminLoginPage.isLoggedIn();
    //await expect(adminLoginPage.dashboardTitle).toHaveText(Titles.adminDashboard);
});