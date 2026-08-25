import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../pages/CheckoutPage';
import { LoginPage } from '../pages/LoginPage';
import { ShopPage } from '../pages/ShopPage';

test('用户可以登录、加购并提交订单', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const shopPage = new ShopPage(page);
  const checkoutPage = new CheckoutPage(page);

  await loginPage.goto();
  await loginPage.login('qa.user', 'P@ssw0rd');
  await loginPage.expectLoggedIn();

  await shopPage.addProduct('Wireless Mouse');
  await expect(shopPage.cartCount).toHaveText('1');
  await shopPage.openCart();
  await checkoutPage.expectProductInCart('Wireless Mouse');
  await checkoutPage.placeOrder('测试用户', '上海市浦东新区');

  await expect(page.getByTestId('order-success')).toContainText('订单提交成功');
});
