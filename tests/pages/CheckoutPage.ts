import { expect, type Locator, type Page } from '@playwright/test';

export class CheckoutPage {
  readonly orderError: Locator;

  constructor(private readonly page: Page) {
    this.orderError = page.getByTestId('order-error');
  }

  async expectProductInCart(productName: string) {
    await expect(this.page.getByTestId('cart-items')).toContainText(productName);
  }

  async placeOrder(customerName: string, address: string) {
    await this.page.getByTestId('customer-name').fill(customerName);
    await this.page.getByTestId('address').fill(address);
    await this.page.getByTestId('place-order').click();
  }
}