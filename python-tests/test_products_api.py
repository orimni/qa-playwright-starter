import requests

def test_health_check(base_url):
    """验证服务健康检查接口状态"""
    url = f"{base_url}/api/health"
    response = requests.get(url)
    assert response.status_code == 200
    data = response.json()
    assert data.get("status") == "ok"

def test_products_contract_and_schema(base_url):
    """验证商品列表接口返回契约与字段数据类型"""
    url = f"{base_url}/api/products"
    response = requests.get(url)
    assert response.status_code == 200
    products = response.json()
    
    assert isinstance(products, list)
    assert len(products) >= 3

    # 校验每个商品对象的关键契约字段
    for item in products:
        assert isinstance(item["id"], int)
        assert isinstance(item["name"], str) and len(item["name"]) > 0
        assert isinstance(item["price"], (int, float)) and item["price"] > 0
        assert isinstance(item["description"], str)
