import { test, expect } from '@playwright/test';

type InvalidOrderCase = {
  name: string;
  items: number[] | string;
  expectedError: string;
};

const invalidOrderCases: InvalidOrderCase[] = [
  {
    name: '空购物车',
    items: [],
    expectedError: '订单信息不完整',
  },
  {
    name: '不存在的商品',
    items: [999],
    expectedError: '商品不存在',
  },
  {
  name: '商品列表不是数组',
  items: '1',
  expectedError: '订单信息不完整',
  },
  {
  name: '订单包含不存在的商品',
  items: [1, 999],
  expectedError: '商品不存在',
  },
];

for (const orderCase of invalidOrderCases) {
  test(`${orderCase.name}不能创建订单`, async ({ request }) => {
    const response = await request.post('/api/orders', {
      data: {
        customerName: '测试用户',
        address: '上海市浦东新区',
        items: orderCase.items,
      },
    });

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body).toEqual({ error: orderCase.expectedError });
  });
}

test('包含商品时可以创建订单', async ({ request }) => {
  const response = await request.post('/api/orders', {
    data: {
      customerName: '测试用户',
      address: '上海市浦东新区',
      items: [1],
    },
  });

  expect(response.status()).toBe(201);

  const body = await response.json();
  expect(body.status).toBe('confirmed');
  expect(body.orderId).toMatch(/^ORD-/);
});