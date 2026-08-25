import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('登录功能', () => {
  test('错误账号应显示明确的错误提示', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('wrong.user', 'wrong-password');
    await expect(loginPage.error).toHaveText('用户名或密码错误');
  });

  test('正确账号应进入商品列表', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('qa.user', 'P@ssw0rd');
    await loginPage.expectLoggedIn();
    await expect(page.getByTestId('product-list')).toContainText('Wireless Mouse');
    await expect(page.getByTestId('product-card')).toHaveCount(3);
  });
});
