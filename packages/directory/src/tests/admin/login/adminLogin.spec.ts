import { test, expect } from '@playwright/test';
import LoginPage from '../../../pages/login/LoginPage';
import { NonExistentUser, Users, KeyWords, Strings, PageConstantMessages } from '../../../constants/index';

test('DIR-000001 Login with valid credentials as web administrator', async ({ page }) => {
    const adminLoginPage = new LoginPage(page);
    await adminLoginPage.navigateToAdminLogin();
    await adminLoginPage.loginAsAdmin();
    await adminLoginPage.isLoggedIn(page);
});

test('DIR-000002 Login with non existent user', async ({ page }) => {
    const adminLoginPage = new LoginPage(page);
    await adminLoginPage.navigateToAdminLogin();
    await adminLoginPage.usernameInput.fill(NonExistentUser.username || "");
    await adminLoginPage.passwordInput.fill(NonExistentUser.password || "");
    await adminLoginPage.submitButton.click();
    await expect(adminLoginPage.alertPopUp).toBeVisible();
    await expect(adminLoginPage.wrongPasswordMessage).toHaveText('Usuario o contraseña incorrectos')
});

test('DIR-000003 Login with empty credentials', async ({ page }) => {
    const adminLoginPage = new LoginPage(page);
    const usernameRedAlert = adminLoginPage.fieldRedAlert.nth(0);
    const passwordRedAlert = adminLoginPage.fieldRedAlert.nth(1);

    await adminLoginPage.navigateToAdminLogin();
    await adminLoginPage.submitButton.click();
    await expect(adminLoginPage.alertPopUp).toBeHidden();
    await expect(adminLoginPage.fieldRedAlert).toHaveCount(2);
    await expect(usernameRedAlert).toHaveText(PageConstantMessages.requiredField);
    await expect(passwordRedAlert).toHaveText(PageConstantMessages.requiredField);
});

test('DIR-000004 Login with invalid email format in username field', async ({ page }) => {
    const adminLoginPage = new LoginPage(page);
    const usernameRedAlert = adminLoginPage.fieldRedAlert.nth(0);
    const passwordRedAlert = adminLoginPage.fieldRedAlert.nth(1);

    await adminLoginPage.navigateToAdminLogin();
    await adminLoginPage.usernameInput.fill(KeyWords.testWord || "");
    await adminLoginPage.passwordInput.fill(NonExistentUser.password || "");
    await adminLoginPage.submitButton.click();
    await expect(adminLoginPage.alertPopUp).toBeHidden();
    await expect(adminLoginPage.fieldRedAlert).toHaveCount(2);
    await expect(usernameRedAlert).toHaveText(PageConstantMessages.badEmailFormat);
    await expect(passwordRedAlert).toHaveText(Strings.emptyString);
});

test('DIR-000005 Login with an existent user but wrong password', async ({ page }) => {
    const adminLoginPage = new LoginPage(page);
    await adminLoginPage.navigateToAdminLogin();
    await adminLoginPage.usernameInput.fill(Users.admin.username || "");
    await adminLoginPage.passwordInput.fill(NonExistentUser.password || "");
    await adminLoginPage.submitButton.click();
    await expect(adminLoginPage.alertPopUp).toBeVisible();
    await expect(adminLoginPage.wrongPasswordMessage).toHaveText('Usuario o contraseña incorrectos')
});
