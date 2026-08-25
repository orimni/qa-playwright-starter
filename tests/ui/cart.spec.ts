import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ShopPage } from '../pages/ShopPage';

test('添加两个商品时购物车数量应为 2', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const shopPage = new ShopPage(page);

  await loginPage.goto();
  await loginPage.login('qa.user', 'P@ssw0rd');
  await loginPage.expectLoggedIn();

  await shopPage.addProduct('Wireless Mouse');
  await shopPage.addProduct('Mechanical Keyboard');

  await expect(shopPage.cartCount).toHaveText('2');
});