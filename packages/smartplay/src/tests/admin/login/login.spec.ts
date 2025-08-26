import { test, expect } from '@playwright/test';
import AdminLoginPage from '../../../pages/admin/AdminLoginPage';
import { NonExistentUser, Titles, Users } from '../../../constants/index';

test('SMP-000001 Login with valid credentials as web administrator', async ({ page }) => {
    const adminLoginPage = new AdminLoginPage(page);
    await adminLoginPage.navigateToAdminLogin();
    await adminLoginPage.loginAsAdmin();
    //await adminLoginPage.isLoggedIn();
    //await expect(adminLoginPage.dashboardTitle).toHaveText(Titles.adminDashboard);
});
