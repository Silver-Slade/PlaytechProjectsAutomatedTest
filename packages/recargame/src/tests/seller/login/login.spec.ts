import { test, expect } from '@playwright/test';
import { NonExistentUser, Titles, Users } from '../../../constants/index';
import SellerLoginPage from '../../../pages/seller/SellerLoginPage';

test('REC-000007 Login with valid credentials as a seller', async ({ page }) => {
    const sellerLoginPage = new SellerLoginPage(page);
    await sellerLoginPage.navigateToSellerLogin();
    await sellerLoginPage.loginAsSeller();
    await sellerLoginPage.isLoggedIn();
    await expect(sellerLoginPage.dashboardTitle).toHaveText(Titles.sellerHome);
});

test('REC-000008 Login with a non existent seller user', async ({ page }) => {
    const sellerLoginPage = new SellerLoginPage(page);
    await sellerLoginPage.navigateToSellerLogin();
    await sellerLoginPage.usernameInput.fill(NonExistentUser.username);
    await sellerLoginPage.passwordInput.fill(NonExistentUser.password);
    await sellerLoginPage.submitButton.click();
    await expect(sellerLoginPage.dashboardTitle).toHaveCount(0);
    await expect(sellerLoginPage.alertPopUpTitle).toHaveText('Error 70');
    await expect(sellerLoginPage.alertPopUpContent).toContainText(`Descripción: El usuario con login ${NonExistentUser.username} no existe dentro del sistema` +
        ' Recomendaciones: Verifique el login e intente de nuevo');
});

test('REC-000009 Login with empy credentials as seller', async ({ page }) => {
    const sellerLoginPage = new SellerLoginPage(page);
    await sellerLoginPage.navigateToSellerLogin();
    await sellerLoginPage.submitButton.click();
    await expect(sellerLoginPage.alertPopUpTitle).toHaveText('Error');
    await expect(sellerLoginPage.alertPopUpContent).toHaveText('Complete los siguientes campos: - Usuario - Contraseña');
});

test('REC-000010 Login as seller with an existent user but wrong password', async ({ page }) => {
    const sellerLoginPage = new SellerLoginPage(page);
    await sellerLoginPage.navigateToSellerLogin();
    await sellerLoginPage.usernameInput.fill(Users.seller.username || '');
    await sellerLoginPage.passwordInput.fill('wrongPassword');
    await sellerLoginPage.submitButton.click();
    await expect(sellerLoginPage.dashboardTitle).toHaveCount(0);
    await expect(sellerLoginPage.alertPopUpTitle).toHaveText('Error 50');
    await expect(sellerLoginPage.alertPopUpContent).toHaveText('Descripción: Usuario o contraseña incorrecta Recomendaciones: ' +
        'Asegúrese de que no está encendido las mayúsculas');
});

test('REC-000011 Login with an admin account in the seller web', async ({ page }) => {
    const sellerLoginPage = new SellerLoginPage(page);
    await sellerLoginPage.navigateToSellerLogin();
    await sellerLoginPage.usernameInput.fill(Users.admin.username || '');
    await sellerLoginPage.passwordInput.fill(Users.admin.password || '');
    await sellerLoginPage.submitButton.click();
    await expect(sellerLoginPage.dashboardTitle).toHaveCount(0);
    await expect(sellerLoginPage.alertPopUpTitle).toHaveText('Error 300');
    await expect(sellerLoginPage.alertPopUpContent).toHaveText('Descripción: El usuario no es web ' +
        'Recomendaciones: comuniquese con su superior');
});
