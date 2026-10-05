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

    console.log('\n[12] Coupons');
    const Coupon = require(path.join(ROOT, 'server/models/Coupon'));
    await Product.updateMany({}, { $set: { stock: 100 } });
    const post = (c, u, b) => c.req('POST', u, b);
    r = await a.req('POST', '/api/admin/coupons', { code: 'HACK', type: 'flat', value: 50 }); ok(r.status === 403, 'customer cannot create coupons');
    r = await new Client().req('GET', '/api/admin/coupons'); ok(r.status === 401, 'coupon list needs login');
    r = await adm.req('POST', '/api/admin/coupons', { code: 'welcome10', type: 'percent', value: 10, maxDiscount: 100, minOrder: 500, perUserLimit: 1, description: '10% off' });
    ok(r.status === 201 && r.data.code === 'WELCOME10' && r.data.active === true, 'admin creates coupon (code upper-cased)'); const wid = r.data._id;
    r = await adm.req('POST', '/api/admin/coupons', { code: 'WELCOME10', type: 'flat', value: 5 }); ok(r.status === 409, 'duplicate code rejected');
    r = await adm.req('POST', '/api/admin/coupons', { code: 'BAD1', type: 'percent', value: 150 }); ok(r.status === 400, 'percent over 100 rejected');
    r = await adm.req('POST', '/api/admin/coupons', { code: 'a b', type: 'flat', value: 5 }); ok(r.status === 400, 'invalid code characters rejected');
    r = await adm.req('POST', '/api/admin/coupons', { code: 'BAD2', type: 'flat', value: 5, startsAt: '2030-01-02', expiresAt: '2030-01-01' }); ok(r.status === 400, 'expiry before start rejected');
    r = await adm.req('POST', '/api/admin/coupons', { code: 'FLAT50', type: 'flat', value: 50, usageLimit: 2, perUserLimit: 0 }); ok(r.status === 201, 'flat coupon created'); const fid = r.data._id;
    r = await adm.req('POST', '/api/admin/coupons', { code: 'BIGFLAT', type: 'flat', value: 99999, perUserLimit: 0 }); ok(r.status === 201, 'huge flat coupon created');
    r = await adm.req('POST', '/api/admin/coupons', { code: 'OLD', type: 'flat', value: 10, expiresAt: '2020-01-01' }); ok(r.status === 201, 'expired coupon created');
    r = await adm.req('POST', '/api/admin/coupons', { code: 'SOON', type: 'flat', value: 10, startsAt: '2099-01-01' }); ok(r.status === 201, 'future coupon created');

    await setCart([{ name: P3, quantity: 1 }]); // 4725
    r = await post(a, '/api/coupons/validate', { code: 'welcome10' });
    ok(r.status === 200 && r.data.discount === 100 && r.data.total === 4625, '10% capped at max discount Rs 100 -> total 4625 (lowercase code works)');
    r = await post(new Client(), '/api/coupons/validate', { code: 'WELCOME10' }); ok(r.status === 401, 'coupon check needs login');
    r = await post(a, '/api/coupons/validate', { code: 'NOPE' }); ok(r.status === 400, 'unknown code rejected');
    r = await post(a, '/api/coupons/validate', { code: 'OLD' }); ok(r.status === 400 && /expired/i.test(r.data.error), 'expired coupon rejected');
    r = await post(a, '/api/coupons/validate', { code: 'SOON' }); ok(r.status === 400 && /not active/i.test(r.data.error), 'not-yet-started coupon rejected');
    await setCart([{ name: P1, quantity: 1 }]); // 164
    r = await post(a, '/api/coupons/validate', { code: 'WELCOME10' }); ok(r.status === 400 && /at least/i.test(r.data.error), 'minimum order enforced');
    r = await post(a, '/api/coupons/validate', { code: 'FLAT50' }); ok(r.status === 200 && r.data.discount === 50 && r.data.delivery === 60 && r.data.total === 174, 'flat 50 on 164 + 60 delivery = 174');
    r = await post(a, '/api/coupons/validate', { code: 'BIGFLAT' }); ok(r.status === 200 && r.data.discount === 164 && r.data.total === 60, 'discount never exceeds the cart value (delivery still charged)');

    // COD order with a coupon. The browser cannot choose the discount or total.
    await setCart([{ name: P3, quantity: 1 }]);
    r = await post(a, '/api/orders', { customer: TEST_ADDR, paymentMethod: 'cod', couponCode: 'welcome10', idempotencyKey: 'cpn-key-aaaaaaaaaaaa1', discount: 99999, total: 1 });
    ok(r.status === 201 && r.data.discount === 100 && r.data.couponCode === 'WELCOME10' && r.data.total === 4625, 'COD order uses server-calculated coupon discount (forged total ignored)'); const co = r.data;
    ok((await Coupon.findOne({ code: 'WELCOME10' })).usedCount === 1, 'coupon usedCount = 1');
    await setCart([{ name: P3, quantity: 1 }]);
    r = await post(a, '/api/coupons/validate', { code: 'WELCOME10' }); ok(r.status === 400 && /already used/i.test(r.data.error), 'per-customer limit: same user cannot reuse');
    r = await post(a, '/api/orders', { customer: TEST_ADDR, paymentMethod: 'cod', couponCode: 'WELCOME10', idempotencyKey: 'cpn-key-aaaaaaaaaaaa2' }); ok(r.status === 409, 'order with an already-used coupon is refused');
    ok((await Coupon.findOne({ code: 'WELCOME10' })).usedCount === 1, 'refused order did not consume the coupon');
    r = await post(a, '/api/orders', { customer: TEST_ADDR, paymentMethod: 'cod', idempotencyKey: 'cpn-key-aaaaaaaaaaaa3' }); ok(r.status === 201 && r.data.discount === 0 && r.data.total === 4725, 'order without coupon has no discount');
    r = await a.req('GET', '/api/orders/' + co.orderId); ok(r.data.discount === 100 && r.data.couponCode === 'WELCOME10', 'saved order stores coupon + discount');
    r = await adm.req('GET', '/api/admin/orders'); ok(r.data.find(o => o.orderId === co.orderId)?.couponCode === 'WELCOME10', 'admin order list shows the coupon');
    r = await fetch(BASE + '/api/orders/' + co.orderId + '/invoice', { headers: { cookie: a.cookie } }); const ib = Buffer.from(await r.arrayBuffer()); ok(r.status === 200 && ib.slice(0, 4).toString() === '%PDF', 'invoice with coupon line generates');
    r = await a.req('PATCH', '/api/orders/' + co.orderId + '/cancel', {}); ok(r.status === 200, 'order with coupon cancelled');
    ok((await Coupon.findOne({ code: 'WELCOME10' })).usedCount === 0, 'cancelling the order gives the coupon use back');
    await setCart([{ name: P3, quantity: 1 }]);
    r = await post(a, '/api/coupons/validate', { code: 'WELCOME10' }); ok(r.status === 200, 'coupon usable again after the order was cancelled');

    // Total usage limit (FLAT50: 2 uses). Alice, Mallory ok, Carol blocked.
    const carol = new Client(); await carol.req('POST', '/api/auth/register', { name: 'Carol', email: 'c@example.com', password: 'secret123' });
    const buy = async (c, key) => { await c.req('PUT', '/api/cart', { items: [{ name: P1, quantity: 1 }] }); return c.req('POST', '/api/orders', { customer: TEST_ADDR, paymentMethod: 'cod', couponCode: 'FLAT50', idempotencyKey: key }); };
    r = await buy(a, 'lim-key-aaaaaaaaaaaaaaa1'); ok(r.status === 201 && r.data.total === 174, 'usage 1 of 2 ok');
    r = await buy(mallory, 'lim-key-aaaaaaaaaaaaaaa2'); ok(r.status === 201, 'usage 2 of 2 ok');
    r = await buy(carol, 'lim-key-aaaaaaaaaaaaaaa3'); ok(r.status === 409 && /usage limit/i.test(r.data.error), 'usage limit reached: 3rd customer refused');
    const fc = await Coupon.findOne({ code: 'FLAT50' }); ok(fc.usedCount === 2, 'usedCount stays at the limit (2)');
    ok((await Order.countDocuments({ couponCode: 'FLAT50' })) === 2, 'refused order was not saved');
    // Two buyers racing for one last use
    await Coupon.updateOne({ code: 'FLAT50' }, { $set: { usageLimit: 3, usedCount: 2 } });
    await mallory.req('PUT', '/api/cart', { items: [{ name: P1, quantity: 1 }] }); await carol.req('PUT', '/api/cart', { items: [{ name: P1, quantity: 1 }] });
    const race = await Promise.all([carol.req('POST', '/api/orders', { customer: TEST_ADDR, paymentMethod: 'cod', couponCode: 'FLAT50', idempotencyKey: 'race-key-aaaaaaaaaaaa1' }), mallory.req('POST', '/api/orders', { customer: TEST_ADDR, paymentMethod: 'cod', couponCode: 'FLAT50', idempotencyKey: 'race-key-aaaaaaaaaaaa2' })]);
    console.log('    race statuses:', race.map(x => x.status + ' ' + (x.data.error || '')).join(' | '));
    ok(race.filter(x => x.status === 201).length === 1 && (await Coupon.findOne({ code: 'FLAT50' })).usedCount === 3, 'race for the last use: exactly one wins');

    // Switch off (band), switch on, delete
    r = await adm.req('PATCH', '/api/admin/coupons/' + wid, { active: false }); ok(r.status === 200 && r.data.active === false, 'admin disables a coupon');
    r = await post(a, '/api/coupons/validate', { code: 'WELCOME10' }); ok(r.status === 400, 'disabled coupon cannot be used');
    r = await a.req('PATCH', '/api/admin/coupons/' + wid, { active: true }); ok(r.status === 403, 'customer cannot toggle coupons');
    r = await adm.req('PATCH', '/api/admin/coupons/' + wid, { active: true }); ok(r.status === 200 && r.data.active === true, 'admin enables it again');
    await setCart([{ name: P3, quantity: 1 }]); r = await post(a, '/api/coupons/validate', { code: 'WELCOME10' }); ok(r.status === 200, 'enabled coupon works again');
    r = await adm.req('GET', '/api/admin/coupons'); ok(r.status === 200 && r.data.length === 5, 'admin lists all coupons');

    // Online payment with a coupon (Razorpay amount must be the discounted amount)
    await setCart([{ name: P3, quantity: 1 }]);
    const ck = 'cpn-pay-key-aaaaaaaaaa';
    let rz3 = await post(a, '/api/payments/razorpay/order', { idempotencyKey: ck, couponCode: 'WELCOME10' }); ok(rz3.status === 200 && rz3.data.amount === 462500, 'razorpay order uses the discounted amount (462500 paise)');
    const pay3 = await ctrl('/pay', { order_id: rz3.data.id });
    r = await post(a, '/api/payments/razorpay/verify', Object.assign({ idempotencyKey: ck, couponCode: 'WELCOME10' }, pay3)); ok(r.status === 200 && r.data.verified, 'verify ok with coupon');
    r = await post(a, '/api/orders', { customer: TEST_ADDR, paymentMethod: 'online', paymentId: pay3.razorpay_payment_id, razorpayOrderId: pay3.razorpay_order_id, razorpaySignature: pay3.razorpay_signature, idempotencyKey: ck, couponCode: 'WELCOME10' });
    ok(r.status === 201 && r.data.total === 4625 && r.data.paymentStatus === 'paid' && r.data.discount === 100, 'online order with coupon created and paid');
    ok(!(await ctrl('/refunds')).some(x => x.payment_id === pay3.razorpay_payment_id), 'no refund for a good coupon order');
    await setCart([{ name: P3, quantity: 1 }]);
    // Coupon switched off AFTER the customer paid => payment is refunded, no order is created
    await Coupon.updateOne({ code: 'FLAT50' }, { $set: { active: true, usageLimit: 0, usedCount: 0, perUserLimit: 0, minOrder: 0 } });
    await carol.req('PUT', '/api/cart', { items: [{ name: P3, quantity: 1 }] });
    const ck3 = 'cpn-pay-key-cccccccccc'; const rz5 = await post(carol, '/api/payments/razorpay/order', { idempotencyKey: ck3, couponCode: 'FLAT50' }); ok(rz5.status === 200 && rz5.data.amount === 467500, 'flat 50 off 4725 -> 467500 paise');
    const pay5 = await ctrl('/pay', { order_id: rz5.data.id });
    await adm.req('PATCH', '/api/admin/coupons/' + fid, { active: false });
    r = await post(carol, '/api/orders', { customer: TEST_ADDR, paymentMethod: 'online', paymentId: pay5.razorpay_payment_id, razorpayOrderId: pay5.razorpay_order_id, razorpaySignature: pay5.razorpay_signature, idempotencyKey: ck3, couponCode: 'FLAT50' });
    ok(r.status === 409 && /coupon/i.test(r.data.error), 'coupon switched off after payment => order refused with a coupon message');
    const rfs = (await ctrl('/refunds')).filter(x => x.payment_id === pay5.razorpay_payment_id); ok(rfs.length === 1 && rfs[0].amount === 467500, 'the paid amount (4675.00) was refunded exactly once, automatically');
    ok(!(await Order.exists({ paymentId: pay5.razorpay_payment_id })), 'no order was created for the refunded payment');

    // Delete
    r = await adm.req('DELETE', '/api/admin/coupons/' + fid); ok(r.status === 200, 'admin deletes a coupon');
    r = await adm.req('DELETE', '/api/admin/coupons/' + fid); ok(r.status === 404, 'deleting again -> 404');
    r = await a.req('DELETE', '/api/admin/coupons/' + wid); ok(r.status === 403, 'customer cannot delete coupons');
    r = await post(a, '/api/coupons/validate', { code: 'FLAT50' }); ok(r.status === 400, 'deleted coupon cannot be used');
  } catch (e) { fail++; failures.push('CRASH ' + e.stack); console.log('CRASH', e.stack); }
  finally { srv.kill(); await mongoose.disconnect(); }
  console.log(`\n${pass} passed, ${fail} failed`); if (fail) { console.log('Failures:\n - ' + failures.join('\n - ')); console.log('\n--- server log tail ---\n' + log.slice(-1500)); }
  process.exit(fail ? 1 : 0);
})();
