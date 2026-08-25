import { test, expect } from '@playwright/test';

test.describe('商品与登录 API', () => {
  test('商品接口返回符合基本契约的数据', async ({ request }) => {
    const response = await request.get('/api/products');
    expect(response.ok()).toBeTruthy();
    const products = await response.json();
    expect(products.length).toBeGreaterThanOrEqual(3);
    expect(products[0]).toEqual(expect.objectContaining({ id: expect.any(Number), name: expect.any(String), price: expect.any(Number) }));
    expect(response.status()).toBe(200);
  });

  test('错误账号不能登录', async ({ request }) => {
    const response = await request.post('/api/login', { data: { username: 'wrong.user', password: 'wrong-password' } });
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ error: '用户名或密码错误' });
  });

  test('正确账号返回 token', async ({ request }) => {
    const response = await request.post('/api/login', { data: { username: 'qa.user', password: 'P@ssw0rd' } });
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ token: 'demo-token', user: { username: 'qa.user' } });
  });
});
