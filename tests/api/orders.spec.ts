import { test, expect } from '@playwright/test';

const VALID_TOKEN = 'Bearer demo-token';

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

test.describe('订单接口鉴权校验', () => {
  test('未携带 Token 请求下单应返回 401 未授权', async ({ request }) => {
    const response = await request.post('/api/orders', {
      data: {
        customerName: '测试用户',
        address: '上海市浦东新区',
        items: [1],
      },
    });

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body).toEqual({ error: '未授权或登录已过期' });
  });

  test('携带无效 Token 请求下单应返回 401 未授权', async ({ request }) => {
    const response = await request.post('/api/orders', {
      headers: {
        Authorization: 'Bearer invalid-token-xyz',
      },
      data: {
        customerName: '测试用户',
        address: '上海市浦东新区',
        items: [1],
      },
    });

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body).toEqual({ error: '未授权或登录已过期' });
  });
});

test.describe('订单数据驱动与参数校验', () => {
  for (const orderCase of invalidOrderCases) {
    test(`${orderCase.name}不能创建订单`, async ({ request }) => {
      const response = await request.post('/api/orders', {
        headers: {
          Authorization: VALID_TOKEN,
        },
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
});

test.describe('订单正常创建与详情查询', () => {
  test('正常提交商品应成功创建订单并准确计算总金额', async ({ request }) => {
    // 购买 ID 为 1 (129.0) 与 ID 为 2 (399.0) 的商品，总额应为 528.0
    const response = await request.post('/api/orders', {
      headers: {
        Authorization: VALID_TOKEN,
      },
      data: {
        customerName: '测试用户',
        address: '上海市浦东新区',
        items: [1, 2],
      },
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.status).toBe('confirmed');
    expect(body.orderId).toMatch(/^ORD-/);
    expect(body.totalAmount).toBe(528.0);
    expect(body.itemCount).toBe(2);

    // 查询订单详情接口，核验底层数据一致性
    const detailResponse = await request.get(`/api/orders/${body.orderId}`, {
      headers: {
        Authorization: VALID_TOKEN,
      },
    });

    expect(detailResponse.status()).toBe(200);
    const orderDetail = await detailResponse.json();
    expect(orderDetail.orderId).toBe(body.orderId);
    expect(orderDetail.totalAmount).toBe(528.0);
    expect(orderDetail.items).toEqual([1, 2]);
    expect(orderDetail.customerName).toBe('测试用户');
  });
});
