import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;
  readonly error: Locator;

  constructor(private readonly page: Page) {
    this.username = page.getByTestId('username');
    this.password = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-submit');
    this.error = page.getByTestId('login-error');
  }

  async goto() { await this.page.goto('/'); }

  async login(username: string, password: string) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();
  }

  async expectLoggedIn() {
    await expect(this.page.getByTestId('shop-view')).toBeVisible();
  }
}
