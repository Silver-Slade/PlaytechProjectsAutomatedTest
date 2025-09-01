import { test, expect } from '@playwright/test';
import AdminLoginPage from '../../../pages/admin/AdminLoginPage';
import { NonExistentUser, Titles, Users } from '../../../constants/index';

test('SMP-000001 Login with valid credentials as web superuser', async ({ page }) => {
    const adminLoginPage = new AdminLoginPage(page);
    await adminLoginPage.navigateToAdminLogin();
    await adminLoginPage.loginAsAdmin();
    await adminLoginPage.isLoggedIn(page);
});

test('SMP-000002 Login with invalid credentials', async ({ page }) => {
    const adminLoginPage = new AdminLoginPage(page);
    await adminLoginPage.navigateToAdminLogin();
    await adminLoginPage.usernameInput.fill(NonExistentUser.username || "");
    await adminLoginPage.passwordInput.fill(NonExistentUser.password || "");
    await adminLoginPage.submitButton.click();
    await expect(adminLoginPage.alertPopUpContent).toBeVisible();
    await expect(adminLoginPage.alertPopUpContent).toContainText("Credenciales incorrectas " +
        "Por favor, verifica tu usuario o contraseña e intenta de nuevo.");
});

test('SMP-000003 Login with empty credentials', async ({ page }) => {
    const adminLoginPage = new AdminLoginPage(page);
    await adminLoginPage.navigateToAdminLogin();
    await adminLoginPage.submitButton.click();
    await expect(adminLoginPage.alertPopUpContent).toBeVisible();
    await expect(adminLoginPage.alertPopUpContent).toContainText("¡Error! Complete los siguientes campos: - Usuario - Contraseña");
}); 

test('SMP-000004 Login with an existent user but wrong credentials', async ({ page }) => {
    const adminLoginPage = new AdminLoginPage(page);
    await adminLoginPage.navigateToAdminLogin();
    await adminLoginPage.usernameInput.fill(process.env.USERNAME_SUPERADMIN || "");
    await adminLoginPage.passwordInput.fill(NonExistentUser.password || "");
    await adminLoginPage.submitButton.click();
    await expect(adminLoginPage.alertPopUpContent).toBeVisible();
    await expect(adminLoginPage.alertPopUpContent).toContainText("Credenciales incorrectas " +
        "Por favor, verifica tu usuario o contraseña e intenta de nuevo.");
});

test('SMP-000005 Login with a seller account', async ({ page }) => {
    const adminLoginPage = new AdminLoginPage(page);
    await adminLoginPage.navigateToAdminLogin();
    await adminLoginPage.usernameInput.fill(process.env.USERNAME_SELLER || "");
    await adminLoginPage.passwordInput.fill(process.env.PASSWORD_SELLER || "");
    await adminLoginPage.submitButton.click();
    await expect(adminLoginPage.alertPopUpContent).toBeVisible();
    await expect(adminLoginPage.alertPopUpContent).toContainText(`El usuario ${process.env.USERNAME_SELLER} no es un usuario de Sistema Intentelo de nuevo con un usuario del sistema`);
});


