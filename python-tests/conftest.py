import pytest
import requests
import subprocess
import time
import socket
import os

BASE_URL = "http://127.0.0.1:3000"
VALID_TOKEN = "Bearer demo-token"

def is_server_running(host="127.0.0.1", port=3000):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.5)
        return s.connect_ex((host, port)) == 0

@pytest.fixture(scope="session", autouse=True)
def ensure_server():
    """如果本地测试服务未启动，自动拉起 node server.js 并于测试结束后回收"""
    process = None
    if not is_server_running():
        server_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "demo-app", "server.js"))
        process = subprocess.Popen(["node", server_path], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        # 等待服务就绪
        for _ in range(30):
            if is_server_running():
                break
            time.sleep(0.1)
    
    yield

    if process:
        process.terminate()
        try:
            process.wait(timeout=2)
        except subprocess.TimeoutExpired:
            process.kill()

@pytest.fixture(scope="session")
def base_url():
    """返回测试目标服务基础地址"""
    return BASE_URL

@pytest.fixture(scope="session")
def valid_auth_headers():
    """返回合法鉴权请求头"""
    return {
        "Authorization": VALID_TOKEN,
        "Content-Type": "application/json"
    }

@pytest.fixture(scope="session")
def json_headers():
    """返回标准 JSON 请求头（无鉴权）"""
    return {
        "Content-Type": "application/json"
    }
