import { expect, type Locator, type Page } from '@playwright/test';

export class ShopPage {
  readonly cartButton: Locator;
  readonly cartCount: Locator;

  constructor(private readonly page: Page) {
    this.cartButton = page.getByTestId('cart-button');
    this.cartCount = page.getByTestId('cart-count');
  }

  async addProduct(productName: string) {
    const productCard = this.page.getByTestId('product-card').filter({ hasText: productName });
    await expect(productCard).toBeVisible();
    await productCard.getByRole('button', { name: '加入购物车' }).click();
  }

  async openCart() { await this.cartButton.click(); }
}
