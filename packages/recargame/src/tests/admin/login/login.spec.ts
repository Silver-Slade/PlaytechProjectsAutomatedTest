import { test, expect } from '@playwright/test';
import AdminLoginPage from '../../../pages/admin/AdminLoginPage';
import { NonExistentUser, Titles, Users } from '../../../constants/index';

test('REC-000001 Login with valid credentials as web administrator', async ({ page }) => {
    const adminLoginPage = new AdminLoginPage(page);
    await adminLoginPage.navigateToAdminLogin();
    await adminLoginPage.loginAsAdmin();
    await adminLoginPage.isLoggedIn();
    //await expect(adminLoginPage.dashboardTitle).toHaveText(Titles.adminDashboard);
});

test('REC-000002 Login with a non existent administrator user', async ({ page }) => {
    const adminLoginPage = new AdminLoginPage(page);
    await adminLoginPage.navigateToAdminLogin();
    await adminLoginPage.usernameInput.fill(NonExistentUser.username);
    await adminLoginPage.passwordInput.fill(NonExistentUser.password);
    await adminLoginPage.submitButton.click();
    await expect(adminLoginPage.dashboardTitle).toHaveCount(0);
    await expect(adminLoginPage.alertPopUpTitle).toHaveText('[Error 640]');
    await expect(adminLoginPage.alertPopUpContent).toContainText(' Descripción: El usuario esta inactivo o no existe dentro del sistema. Por favor,' +
        ' verifique la información y vuelva a intentarlo. Recomendaciones: Comuníquese con el administrador.');
});

test('REC-000003 Login with empy credentials as web administrator', async ({ page }) => {
    const adminLoginPage = new AdminLoginPage(page);
    await adminLoginPage.navigateToAdminLogin();
    await adminLoginPage.submitButton.click();
    await expect(adminLoginPage.alertPopUpTitle).toHaveText('Error');
    await expect(adminLoginPage.alertPopUpContent).toHaveText('Complete los siguientes campos: - Usuario - Contraseña');
});

test('REC-000004 Login as web administrator with an existent user but wrong password', async ({ page }) => {
    const adminLoginPage = new AdminLoginPage(page);
    await adminLoginPage.navigateToAdminLogin();
    await adminLoginPage.usernameInput.fill(Users.admin.username || '');
    await adminLoginPage.passwordInput.fill('wrongPassword');
    await adminLoginPage.submitButton.click();
    await expect(adminLoginPage.dashboardTitle).toHaveCount(0);
    await expect(adminLoginPage.alertPopUpTitle).toHaveText('[Error 50]');
    await expect(adminLoginPage.alertPopUpContent).toHaveText('Descripción: Usuario o contraseña incorrecta Recomendaciones: ' +
        'Asegúrese de que no está encendido las mayúsculas');
});
