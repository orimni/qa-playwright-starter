const state = { token: '', products: [], cart: [] };
const $ = (id) => document.getElementById(id);

function show(view) {
  $('login-view').classList.toggle('hidden', view !== 'login');
  $('shop-view').classList.toggle('hidden', view !== 'shop');
  $('cart-view').classList.toggle('hidden', view !== 'cart');
  $('cart-button').hidden = view === 'login';
}

async function login(username, password) {
  const response = await fetch('/api/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error);
  state.token = body.token;
  return body;
}

function renderProducts() {
  $('product-list').innerHTML = state.products.map((product) => `
    <article class="product-card" data-testid="product-card">
      <h2>${product.name}</h2>
      <p>${product.description}</p>
      <p class="price">¥${product.price.toFixed(2)}</p>
      <button data-testid="add-to-cart-${product.id}">加入购物车</button>
    </article>`).join('');
  document.querySelectorAll('[data-testid^="add-to-cart-"]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = Number(button.dataset.testid.replace('add-to-cart-', ''));
      state.cart.push(state.products.find((product) => product.id === id));
      $('cart-count').textContent = String(state.cart.length);
    });
  });
}

function renderCart() {
  $('cart-items').innerHTML = state.cart.map((product) => `<p data-testid="cart-item">${product.name} — ¥${product.price.toFixed(2)}</p>`).join('');
}

$('login-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  $('login-error').textContent = '';
  try {
    const user = await login($('username').value, $('password').value);
    state.products = await fetch('/api/products').then((response) => response.json());
    $('welcome-message').textContent = `你好，${user.user.username}`;
    renderProducts(); show('shop');
  } catch (error) { $('login-error').textContent = error.message; }
});

$('cart-button').addEventListener('click', () => { renderCart(); show('cart'); });
$('continue-shopping').addEventListener('click', () => show('shop'));
$('checkout-form').addEventListener('submit', async (event) => {
  event.preventDefault(); $('order-error').textContent = '';
  const response = await fetch('/api/orders', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${state.token}` },
    body: JSON.stringify({ customerName: $('customer-name').value, address: $('address').value, items: state.cart.map((product) => product.id) }),
  });
  const body = await response.json();
  if (!response.ok) { $('order-error').textContent = body.error; return; }
  $('order-success').textContent = `订单提交成功：${body.orderId}`;
  $('order-success').classList.remove('hidden'); $('continue-shopping').classList.remove('hidden');
});
