import pytest
import requests

# ============================
# 1. 鉴权与安全拦截用例
# ============================

def test_create_order_without_token_returns_401(base_url, json_headers):
    """未携带 Authorization 头请求创建订单应返回 401"""
    url = f"{base_url}/api/orders"
    payload = {
        "customerName": "测试用户",
        "address": "上海市浦东新区",
        "items": [1]
    }
    response = requests.post(url, json=payload, headers=json_headers)
    assert response.status_code == 401
    assert response.json() == {"error": "未授权或登录已过期"}

def test_create_order_with_invalid_token_returns_401(base_url):
    """携带无效或过期 Token 应返回 401"""
    url = f"{base_url}/api/orders"
    headers = {
        "Authorization": "Bearer invalid_or_expired_token",
        "Content-Type": "application/json"
    }
    payload = {
        "customerName": "测试用户",
        "address": "上海市浦东新区",
        "items": [1]
    }
    response = requests.post(url, json=payload, headers=headers)
    assert response.status_code == 401
    assert response.json() == {"error": "未授权或登录已过期"}


# ============================
# 2. 数据驱动异常参数测试
# ============================

INVALID_ORDER_CASES = [
    ("空购物车", [], "订单信息不完整"),
    ("不存在的商品", [999], "商品不存在"),
    ("商品参数不是列表", "1", "订单信息不完整"),
    ("混合包含未知商品", [1, 999], "商品不存在"),
]

@pytest.mark.parametrize("case_name, items_payload, expected_error", INVALID_ORDER_CASES)
def test_create_order_invalid_parameters(base_url, valid_auth_headers, case_name, items_payload, expected_error):
    """数据驱动测试：覆盖空数组、非法类型、未知商品等边界情况"""
    url = f"{base_url}/api/orders"
    payload = {
        "customerName": "测试用户",
        "address": "上海市浦东新区",
        "items": items_payload
    }
    response = requests.post(url, json=payload, headers=valid_auth_headers)
    assert response.status_code == 400
    assert response.json() == {"error": expected_error}


# ============================
# 3. 正常下单与数据核验闭环
# ============================

def test_create_order_and_query_detail_lifecycle(base_url, valid_auth_headers):
    """
    全链路闭环测试：
    1. 正常下单（商品1: 129.0元, 商品2: 399.0元）；
    2. 验证响应状态码 201、订单号生成规则、总金额自动核算 528.0元；
    3. 调取订单详情接口，核验底层持久化数据的一致性。
    """
    url = f"{base_url}/api/orders"
    payload = {
        "customerName": "测试用户",
        "address": "上海市浦东新区",
        "items": [1, 2]
    }
    create_res = requests.post(url, json=payload, headers=valid_auth_headers)
    assert create_res.status_code == 201
    
    order_data = create_res.json()
    assert order_data.get("status") == "confirmed"
    assert order_data.get("orderId", "").startswith("ORD-")
    assert order_data.get("totalAmount") == 528.0
    assert order_data.get("itemCount") == 2

    # 查询订单详情接口
    order_id = order_data["orderId"]
    detail_url = f"{base_url}/api/orders/{order_id}"
    detail_res = requests.get(detail_url, headers=valid_auth_headers)
    assert detail_res.status_code == 200

    detail_data = detail_res.json()
    assert detail_data.get("orderId") == order_id
    assert detail_data.get("customerName") == "测试用户"
    assert detail_data.get("address") == "上海市浦东新区"
    assert detail_data.get("items") == [1, 2]
    assert detail_data.get("totalAmount") == 528.0
    assert detail_data.get("status") == "confirmed"
