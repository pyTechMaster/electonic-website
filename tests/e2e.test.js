// End-to-end test: boots the real server against a real MongoDB-compatible DB + a fake Razorpay.
// Run:  TEST_MONGODB_URI=mongodb://127.0.0.1:27017/tl_e2e node tests/e2e.test.js   (the DB is wiped - use a throw-away one)
const { spawn, spawnSync } = require('child_process');
const crypto = require('crypto'); const path = require('path');
const ROOT = path.join(__dirname, '..');
const TEST_URI = process.env.TEST_MONGODB_URI || 'mongodb://127.0.0.1:27017/tl_e2e';
// SAFETY: these tests DROP the database they connect to. Refuse anything that is not clearly a throw-away test DB.
if (!/\/[^/?]*(test|e2e|tl_)[^/?]*(\?|$)/i.test(TEST_URI)) { console.error('Refusing to run: TEST_MONGODB_URI must point to a database whose name contains "test", "e2e" or "tl_". Got: ' + TEST_URI.replace(/\/\/.*@/, '//***@')); process.exit(2); }
const MONGO = TEST_URI;
const PORT = 3900 + Math.floor(Math.random() * 90), CTRL = PORT + 100;
const ENV = Object.assign({}, process.env, { NODE_ENV: 'test', PORT: String(PORT), MONGODB_URI: MONGO, JWT_SECRET: 'x'.repeat(48),
  RAZORPAY_KEY_ID: 'rzp_test_x', RAZORPAY_KEY_SECRET: 'secret_abc', RAZORPAY_WEBHOOK_SECRET: 'whsec_test', MOCK_CTRL_PORT: String(CTRL),
  ORPHAN_REFUND_AFTER_MINUTES: '0', RECONCILE_INTERVAL_SECONDS: '1', SMTP_HOST: '', SMTP_USER: '', SMTP_PASS: '', DELIVERY_MODE: 'all_india' });
const BASE = 'http://127.0.0.1:' + PORT, CT = 'http://127.0.0.1:' + CTRL;
let pass = 0, fail = 0; const failures = [];
const ok = (c, m) => { if (c) { pass++; console.log('  ✓', m); } else { fail++; failures.push(m); console.log('  ✗ FAIL:', m); } };
const sleep = ms => new Promise(r => setTimeout(r, ms));
class Client { constructor() { this.cookie = ''; }
  async req(method, url, body, headers = {}) {
    const r = await fetch(BASE + url, { method, headers: Object.assign({ 'content-type': 'application/json', cookie: this.cookie }, headers), body: body === undefined ? undefined : (typeof body === 'string' ? body : JSON.stringify(body)) });
    const sc = r.headers.getSetCookie ? r.headers.getSetCookie() : []; sc.forEach(c => { const kv = c.split(';')[0]; if (kv.startsWith('tl_token=')) this.cookie = kv; });
    let data = null; const t = await r.text(); try { data = JSON.parse(t); } catch (_) { data = t; }
    return { status: r.status, data };
  } }
const ctrl = async (u, b) => (await fetch(CT + u, { method: 'POST', body: JSON.stringify(b || {}) })).json();
const run = (script, args = []) => spawnSync('node', [script, ...args], { cwd: ROOT, env: ENV, encoding: 'utf8' });
const TEST_ADDR = { name: 'Test User', phone: '9876543210', email: '', address: '12 Test Street, Area', city: 'Ahmedabad', pin: '380001' };
const P1 = 'Witty Fox 60W Soldering Iron', P2 = 'SG90 Micro Servo Motor 9g', P3 = 'Raspberry Pi 3B+'; // 164, 129, 4725

(async () => {
  const mongoose = require(path.join(ROOT, 'node_modules/mongoose'));
  await mongoose.connect(MONGO); await mongoose.connection.dropDatabase();
  const Product = require(path.join(ROOT, 'server/models/Product')), Order = require(path.join(ROOT, 'server/models/Order')), PaymentAttempt = require(path.join(ROOT, 'server/models/PaymentAttempt'));

  console.log('\n[1] Seed script keeps live stock');
  let r = run('server/scripts/seed-products.js'); ok(r.status === 0, 'seed runs: ' + (r.stdout + r.stderr).trim().slice(0, 90));
  await Product.updateOne({ name: P1 }, { $set: { stock: 7 } }); r = run('server/scripts/seed-products.js');
  ok((await Product.findOne({ name: P1 })).stock === 7, 're-seed does NOT reset stock back to 100');
  r = run('server/scripts/create-admin.js', ['boss@example.com', 'AdminPass12345']); ok(r.status === 0, 'create-admin uses the CLI email: ' + r.stdout.trim());
  ok(!!(await mongoose.connection.db.collection('users').findOne({ email: 'boss@example.com', role: 'admin' })), 'admin user exists for boss@example.com');

  console.log('\n[1b] Root cause of the old COD bug (unique index treats "" as a real value)');
  const col = mongoose.connection.db.collection('rootcause'); await col.createIndex({ paymentId: 1 }, { unique: true, sparse: true });
  await col.insertOne({ n: 1, paymentId: '' }); let dup = false; try { await col.insertOne({ n: 2, paymentId: '' }); } catch (e) { dup = e.code === 11000; }
  ok(dup, 'two docs with paymentId "" collide (that is what broke the 2nd COD order)');
  await col.insertOne({ n: 3 }); await col.insertOne({ n: 4 }); ok(true, 'docs WITHOUT the field never collide (what the fix relies on)');

  const srv = spawn('node', ['-r', './tests/mock-razorpay.js', 'server.js'], { cwd: ROOT, env: ENV });
  let log = ''; srv.stdout.on('data', d => log += d); srv.stderr.on('data', d => log += d);
  for (let i = 0; i < 50; i++) { try { const h = await (await fetch(BASE + '/api/health')).json(); if (h.database === 'connected') break; } catch (_) {} await sleep(200); }

  try {
    console.log('\n[2] Basics');
    const a = new Client();
    r = await a.req('GET', '/api/health'); ok(r.data.database === 'connected', 'health: database connected');
    r = await a.req('GET', '/api/does-not-exist'); ok(r.status === 404 && r.data.error, 'unknown /api path returns JSON 404');
    r = await a.req('GET', '/some/page'); ok(r.status === 200 && String(r.data).includes('Tinkerleaf'), 'SPA fallback serves public/index.html');
    r = await a.req('POST', '/api/auth/login', '{bad json'); ok(r.status === 400 && r.data.error, 'malformed JSON -> JSON 400');
    r = await a.req('POST', '/api/orders', {}); ok(r.status === 401, 'orders need login');
    r = await a.req('POST', '/api/auth/register', { name: 'Alice', email: 'alice@example.com', password: 'secret123' });
    ok(r.status === 201 && r.data.user && !r.data.pendingVerification, 'register (dev, no SMTP) auto-verifies + logs in');
    r = await a.req('POST', '/api/auth/register', { name: 'X', email: 'not-an-email', password: 'secret123' }); ok(r.status === 400, 'register rejects bad email');
    r = await a.req('POST', '/api/auth/register', { name: 'X', email: 'z@example.com', password: { length: 99 } }); ok(r.status === 400, 'register rejects non-string password');

    console.log('\n[3] COD orders (the "2nd COD order crashes" bug)');
    const setCart = items => a.req('PUT', '/api/cart', { items });
    await setCart([{ name: P1, quantity: 2 }]);
    r = await a.req('POST', '/api/orders', { orderId: "x');alert(1);//", customer: TEST_ADDR, paymentMethod: 'cod', idempotencyKey: 'key-aaaaaaaaaaaaaaaa-1', items: [{ name: P1, quantity: 1, price: 1 }], total: 1 });
    ok(r.status === 201, 'COD order #1 created');
    const o1 = r.data; ok(/^TL[0-9A-Z]{9,}$/.test(o1.orderId), 'server generated safe order id: ' + o1.orderId);
    ok(o1.total === 328 + 60, 'server priced the order itself (2x164 + 60 delivery = 388), ignoring client total=1: got ' + o1.total);
    ok((await Product.findOne({ name: P1 })).stock === 5, 'stock reduced 7 -> 5');
    await setCart([{ name: P2, quantity: 1 }]);
    r = await a.req('POST', '/api/orders', { customer: TEST_ADDR, paymentMethod: 'cod', idempotencyKey: 'key-aaaaaaaaaaaaaaaa-2' });
    ok(r.status === 201, 'COD order #2 created (used to fail with duplicate key on paymentId "")');
    const o2 = r.data;
    await setCart([{ name: P2, quantity: 1 }]);
    r = await a.req('POST', '/api/orders', { customer: TEST_ADDR, paymentMethod: 'cod', idempotencyKey: 'key-aaaaaaaaaaaaaaaa-3' }); ok(r.status === 201, 'COD order #3 created');
    ok(!(await Order.findOne({ orderId: o2.orderId })).paymentId, 'COD order has no paymentId stored');

    console.log('\n[4] Idempotency + double-click race');
    await setCart([{ name: P2, quantity: 1 }]); const s0 = (await Product.findOne({ name: P2 })).stock;
    const [x, y] = await Promise.all([1, 2].map(() => a.req('POST', '/api/orders', { customer: TEST_ADDR, paymentMethod: 'cod', idempotencyKey: 'key-race-aaaaaaaaaaaaaa' })));
    ok([x.status, y.status].every(s => s === 200 || s === 201), 'both parallel requests answered OK: ' + x.status + '/' + y.status);
    ok(x.data.orderId === y.data.orderId, 'both got the SAME order id');
    ok((await Order.countDocuments({ idempotencyKey: 'key-race-aaaaaaaaaaaaaa' })) === 1, 'exactly one order stored');
    ok((await Product.findOne({ name: P2 })).stock === s0 - 1, 'stock reduced only once');

    console.log('\n[5] Validation');
    await setCart([{ name: P2, quantity: 1 }]);
    r = await a.req('POST', '/api/orders', { customer: Object.assign({}, TEST_ADDR, { phone: 'abc' }), paymentMethod: 'cod' }); ok(r.status === 400, 'bad phone rejected');
    r = await a.req('POST', '/api/orders', { customer: Object.assign({}, TEST_ADDR, { pin: '12' }), paymentMethod: 'cod' }); ok(r.status === 400 || r.status === 422, 'bad pincode rejected');
    r = await a.req('POST', '/api/orders', { customer: TEST_ADDR, paymentMethod: 'online' }); ok(r.status === 400, 'online order without payment proof rejected');
    r = await setCart([{ name: P2, quantity: 99999 }]); ok(r.status === 409 || r.status === 400, 'cart above stock rejected');

    console.log('\n[6] Customer cancel restores stock exactly once');
    const sBefore = (await Product.findOne({ name: P1 })).stock;
    r = await a.req('PATCH', '/api/orders/' + o1.orderId + '/cancel', { reason: 'changed mind' }); ok(r.status === 200, 'cancel ok');
    ok((await Product.findOne({ name: P1 })).stock === sBefore + 2, 'stock restored (+2)');
    r = await a.req('PATCH', '/api/orders/' + o1.orderId + '/cancel', {}); ok(r.status === 409, 'second cancel refused');
    ok((await Product.findOne({ name: P1 })).stock === sBefore + 2, 'stock NOT restored twice');
    if (process.env.REAL_MONGO === '1') {
      await setCart([{ name: P2, quantity: 1 }]); const rr = await a.req('POST', '/api/orders', { customer: TEST_ADDR, paymentMethod: 'cod', idempotencyKey: 'key-cancel-race-aaaaaa' });
      const [c1, c2] = await Promise.all([a.req('PATCH', '/api/orders/' + rr.data.orderId + '/cancel', {}), a.req('PATCH', '/api/orders/' + rr.data.orderId + '/cancel', {})]);
      ok([c1.status, c2.status].sort().join() === '200,409', 'simultaneous cancels: exactly one wins (got ' + c1.status + ',' + c2.status + ')');
    } else console.log('  - skipped: simultaneous-cancel atomicity (needs real MongoDB; FerretDB/SQLite findAndModify is not atomic). Run with REAL_MONGO=1 against Atlas/mongod.');

    console.log('\n[7] Online payment happy path, then cancel => automatic refund');
    await setCart([{ name: P3, quantity: 1 }]); // 4725, free delivery
    const key = 'pay-key-aaaaaaaaaaaaaaaa'; const rz = await a.req('POST', '/api/payments/razorpay/order', { idempotencyKey: key, receipt: 'r1' });
    ok(rz.status === 200 && rz.data.amount === 472500, 'razorpay order amount computed by server (472500 paise)');
    const rz2 = await a.req('POST', '/api/payments/razorpay/order', { idempotencyKey: key }); ok(rz2.data.id === rz.data.id, 'same key reuses the same razorpay order');
    const pay = await ctrl('/pay', { order_id: rz.data.id });
    r = await a.req('POST', '/api/payments/razorpay/verify', Object.assign({ idempotencyKey: key }, pay)); ok(r.status === 200 && r.data.verified, 'verify ok');
    r = await a.req('POST', '/api/orders', { customer: TEST_ADDR, paymentMethod: 'online', paymentId: pay.razorpay_payment_id, razorpayOrderId: pay.razorpay_order_id, razorpaySignature: pay.razorpay_signature, idempotencyKey: key });
    ok(r.status === 201 && r.data.paymentStatus === 'paid', 'online order created and marked paid'); const on = r.data;
    r = await a.req('POST', '/api/orders', { customer: TEST_ADDR, paymentMethod: 'online', paymentId: pay.razorpay_payment_id, razorpayOrderId: pay.razorpay_order_id, razorpaySignature: pay.razorpay_signature, idempotencyKey: 'another-key-aaaaaaaaaaaa' });
    ok(r.status === 200 && r.data.orderId === on.orderId, 'retry with a NEW key but same payment returns the existing order (no 2nd order, no refund)');
    ok((await ctrl('/refunds')).length === 0, 'no refund issued for a good order');
    ok((await PaymentAttempt.findOne({ razorpayOrderId: rz.data.id })).orderCreated === true, 'payment attempt marked orderCreated');
    r = await a.req('PATCH', '/api/orders/' + on.orderId + '/cancel', {}); ok(r.status === 200 && r.data.order.paymentStatus === 'refunded', 'cancel => paymentStatus refunded');
    const refs = await ctrl('/refunds'); ok(refs.length === 1 && refs[0].amount === 472500, 'exactly one Razorpay refund of the full 4725.00');

    console.log('\n[8] Paid, but cart changed before the order was saved => refund');
    await setCart([{ name: P3, quantity: 1 }]); const k2 = 'pay-key-bbbbbbbbbbbbbbbb';
    const rzb = await a.req('POST', '/api/payments/razorpay/order', { idempotencyKey: k2 }); const payb = await ctrl('/pay', { order_id: rzb.data.id });
    await setCart([{ name: P2, quantity: 1 }]);
    r = await a.req('POST', '/api/payments/razorpay/verify', Object.assign({ idempotencyKey: k2 }, payb)); ok(r.status === 409, 'verify rejects amount mismatch');
    ok((await ctrl('/refunds')).length === 2, 'mismatched payment auto-refunded');
    const sHit = (await Product.findOne({ name: P2 })).stock;
    r = await a.req('POST', '/api/orders', { customer: TEST_ADDR, paymentMethod: 'online', paymentId: 'pay_forged', razorpayOrderId: 'order_x', razorpaySignature: 'abc' }); ok(r.status === 400, 'forged payment proof rejected');
    ok((await Product.findOne({ name: P2 })).stock === sHit, 'stock untouched by forged order');
    const mallory = new Client(); await mallory.req('POST', '/api/auth/register', { name: 'Mallory', email: 'm@example.com', password: 'secret123' });
    await mallory.req('PUT', '/api/cart', { items: [{ name: P3, quantity: 1 }] });

    console.log('\n[9] Money safety net: paid but order never saved (browser closed)');
    await setCart([{ name: P3, quantity: 1 }]); const k3 = 'pay-key-dddddddddddddddd';
    const rzd = await a.req('POST', '/api/payments/razorpay/order', { idempotencyKey: k3 }); const payd = await ctrl('/pay', { order_id: rzd.data.id });
    const body = JSON.stringify({ id: 'evt_1', event: 'payment.captured', payload: { payment: { entity: { id: payd.razorpay_payment_id, order_id: rzd.data.id, status: 'captured' } } } });
    const sig = crypto.createHmac('sha256', 'whsec_test').update(body).digest('hex');
    let w = await fetch(BASE + '/api/webhooks/razorpay', { method: 'POST', headers: { 'content-type': 'application/json', 'x-razorpay-signature': 'bad' }, body }); ok(w.status === 400, 'webhook with bad signature rejected');
    w = await fetch(BASE + '/api/webhooks/razorpay', { method: 'POST', headers: { 'content-type': 'application/json', 'x-razorpay-signature': sig, 'x-razorpay-event-id': 'evt_1' }, body }); ok(w.status === 200, 'webhook with valid signature accepted');
    w = await (await fetch(BASE + '/api/webhooks/razorpay', { method: 'POST', headers: { 'content-type': 'application/json', 'x-razorpay-signature': sig, 'x-razorpay-event-id': 'evt_1' }, body })).json(); ok(w.duplicate === true, 'duplicate webhook event ignored');
    for (let i = 0; i < 12; i++) { await sleep(500); if ((await ctrl('/refunds')).length >= 3) break; }
    ok((await ctrl('/refunds')).length === 3, 'orphan captured payment was refunded automatically by the reconciler');
    ok(!!(await PaymentAttempt.findOne({ razorpayOrderId: rzd.data.id })).refundedAt, 'attempt marked refunded');

    console.log('\n[10] Admin flow');
    const adm = new Client(); r = await adm.req('POST', '/api/auth/login', { email: 'boss@example.com', password: 'AdminPass12345' }); ok(r.status === 200 && r.data.user.role === 'admin', 'admin login');
    r = await a.req('GET', '/api/admin/orders'); ok(r.status === 403, 'customer cannot read admin orders');
    r = await a.req('POST', '/api/products', { name: 'Hack', price: 1 }); ok(r.status === 403, 'customer cannot create products');
    await setCart([{ name: P2, quantity: 1 }]); r = await a.req('POST', '/api/orders', { customer: TEST_ADDR, paymentMethod: 'cod', idempotencyKey: 'key-admin-flow-aaaaaa' }); const od = r.data.orderId;
    const st = (id, status, extra) => adm.req('PATCH', '/api/admin/orders/' + id + '/status', Object.assign({ status }, extra));
    r = await st(od, 'shipped', { courier: 'Delhivery', trackingNumber: 'T123' }); ok(r.status === 200 && r.data.courier === 'Delhivery', 'placed -> shipped with tracking');
    r = await st(od, 'packed'); ok(r.status === 409, 'cannot move backwards');
    r = await st(od, 'delivered'); ok(r.status === 200 && r.data.paymentStatus === 'paid', 'delivered; COD marked paid');
    r = await st(od, 'cancelled'); ok(r.status === 409, 'delivered order cannot be cancelled');
    r = await a.req('POST', '/api/orders/' + od + '/return-request', { reason: 'not working properly' }); ok(r.status === 201, 'customer return request');
    r = await adm.req('PATCH', '/api/admin/orders/' + od + '/return-request', { status: 'refunded' }); ok(r.status === 200, 'admin marks COD return refunded');
    r = await adm.req('PATCH', '/api/admin/orders/' + od + '/return-request', { status: 'approved' }); ok(r.status === 409, 'finished return cannot be re-opened');
    await setCart([{ name: P2, quantity: 1 }]); const s1 = (await Product.findOne({ name: P2 })).stock;
    r = await a.req('POST', '/api/orders', { customer: TEST_ADDR, paymentMethod: 'cod', idempotencyKey: 'key-admin-cancel-aaaaa' }); const oc = r.data.orderId;
    r = await st(oc, 'cancelled'); ok(r.status === 200 && r.data.status === 'cancelled', 'admin cancel');
    ok((await Product.findOne({ name: P2 })).stock === s1, 'admin cancel restores stock');
    r = await st(oc, 'confirmed'); ok(r.status === 409, 'cancelled order cannot be revived');
    r = await adm.req('GET', '/api/admin/orders'); ok(r.status === 200 && r.data.length > 3 && !r.data.some(o => o.razorpaySignature), 'admin list omits payment signatures');
    r = await adm.req('PUT', '/api/products/' + (await Product.findOne({ name: P2 }))._id, { price: 150, stock: 50, role: 'admin', _id: 'zzz' }); ok(r.status === 200 && r.data.price === 150, 'admin product edit works (extra fields ignored)');
    r = await adm.req('GET', '/api/admin/stats'); ok(r.status === 200 && r.data.revenue > 0, 'stats revenue counts paid orders: ' + r.data.revenue);

    console.log('\n[11] Invoice');
    r = await fetch(BASE + '/api/orders/' + od + '/invoice', { headers: { cookie: a.cookie } }); const buf = Buffer.from(await r.arrayBuffer());
    ok(r.status === 200 && buf.slice(0, 4).toString() === '%PDF' && buf.length > 1500, 'invoice PDF generated (' + buf.length + ' bytes)');
    r = await fetch(BASE + '/api/orders/' + od + '/invoice', { headers: { cookie: mallory.cookie } }); ok(r.status === 404, "another customer cannot download someone else's invoice");
  } catch (e) { fail++; failures.push('CRASH ' + e.stack); console.log('CRASH', e.stack); }
  finally { srv.kill(); await mongoose.disconnect(); }
  console.log(`\n${pass} passed, ${fail} failed`); if (fail) { console.log('Failures:\n - ' + failures.join('\n - ')); console.log('\n--- server log tail ---\n' + log.slice(-1500)); }
  process.exit(fail ? 1 : 0);
})();
