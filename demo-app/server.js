const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const port = Number(process.env.PORT || 3000);
const publicDir = path.join(__dirname, 'public');

const products = [
  { id: 1, name: 'Wireless Mouse', price: 129.0, description: '静音无线鼠标，适合日常办公。' },
  { id: 2, name: 'Mechanical Keyboard', price: 399.0, description: '紧凑型机械键盘，带有舒适的段落感。' },
  { id: 3, name: 'USB-C Hub', price: 159.0, description: '多接口扩展坞，支持显示器和高速传输。' },
];

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try { resolve(body ? JSON.parse(body) : {}); } catch (error) { reject(error); }
    });
    req.on('error', reject);
  });
}

function serveStatic(req, res) {
  const requested = req.url === '/' ? '/index.html' : req.url;
  const filePath = path.normalize(path.join(publicDir, requested));
  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) { res.writeHead(404); res.end('Not found'); return; }
    const type = filePath.endsWith('.html') ? 'text/html; charset=utf-8'
      : filePath.endsWith('.css') ? 'text/css; charset=utf-8'
        : 'application/javascript; charset=utf-8';
    res.writeHead(200, { 'Content-Type': type });
    res.end(content);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'GET' && req.url === '/api/health') {
      sendJson(res, 200, { status: 'ok' }); return;
    }
    if (req.method === 'GET' && req.url === '/api/products') {
      sendJson(res, 200, products); return;
    }
    if (req.method === 'POST' && req.url === '/api/login') {
      const body = await parseBody(req);
      if (body.username !== 'qa.user' || body.password !== 'P@ssw0rd') {
        sendJson(res, 401, { error: '用户名或密码错误' }); return;
      }
      sendJson(res, 200, { token: 'demo-token', user: { username: body.username } }); return;
    }
    if (req.method === 'POST' && req.url === '/api/orders') {
      const body = await parseBody(req);
      if (!body.customerName || !body.address || !Array.isArray(body.items) || body.items.length === 0) {
        sendJson(res, 400, { error: '订单信息不完整' }); return;
      }
      sendJson(res, 201, { orderId: `ORD-${Date.now()}`, status: 'confirmed' }); return;
    }
    if (req.method === 'GET') { serveStatic(req, res); return; }
    sendJson(res, 405, { error: 'Method not allowed' });
  } catch (error) {
    sendJson(res, 500, { error: 'Internal server error' });
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Demo shop is running at http://127.0.0.1:${port}`);
});
