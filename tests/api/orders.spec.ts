import { test, expect } from '@playwright/test';

test('空购物车不能创建订单', async ({ request }) => {
  const response = await request.post('/api/orders', {
    data: { customerName: '测试用户', address: '上海市浦东新区', items: [] },
  });

  expect(response.status()).toBe(400);
  expect(await response.json()).toEqual({ error: '订单信息不完整' });
});
