import requests

def test_login_success(base_url, json_headers):
    """验证正确凭证能成功登录并返回有效 Token"""
    url = f"{base_url}/api/login"
    payload = {
        "username": "qa.user",
        "password": "P@ssw0rd"
    }
    response = requests.post(url, json=payload, headers=json_headers)
    assert response.status_code == 200
    
    data = response.json()
    assert "token" in data
    assert data["token"] == "demo-token"
    assert data.get("user", {}).get("username") == "qa.user"

def test_login_failure_with_wrong_password(base_url, json_headers):
    """验证错误密码登录被拒绝并返回 401"""
    url = f"{base_url}/api/login"
    payload = {
        "username": "qa.user",
        "password": "wrong-password"
    }
    response = requests.post(url, json=payload, headers=json_headers)
    assert response.status_code == 401
    
    data = response.json()
    assert data.get("error") == "用户名或密码错误"

def test_login_failure_with_unknown_user(base_url, json_headers):
    """验证不存在的账号登录被拒绝并返回 401"""
    url = f"{base_url}/api/login"
    payload = {
        "username": "non_exist_user",
        "password": "P@ssw0rd"
    }
    response = requests.post(url, json=payload, headers=json_headers)
    assert response.status_code == 401
    
    data = response.json()
    assert data.get("error") == "用户名或密码错误"
