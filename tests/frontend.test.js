// Loads the real storefront (public/index.html + script.js) in jsdom against a running test server.
const { spawn, spawnSync } = require('child_process'); const path = require('path'); const { JSDOM, VirtualConsole } = require('jsdom');
const ROOT = path.join(__dirname, '..'); const TEST_URI = process.env.TEST_MONGODB_URI || 'mongodb://127.0.0.1:27017/tl_fe';
// SAFETY: these tests DROP the database they connect to. Refuse anything that is not clearly a throw-away test DB.
if (!/\/[^/?]*(test|e2e|tl_)[^/?]*(\?|$)/i.test(TEST_URI)) { console.error('Refusing to run: TEST_MONGODB_URI must point to a database whose name contains "test", "e2e" or "tl_". Got: ' + TEST_URI.replace(/\/\/.*@/, '//***@')); process.exit(2); }
const MONGO = TEST_URI;
const withRzp = process.env.WITH_RZP === '1';
const PORT = 4100 + Math.floor(Math.random() * 90);
const ENV = Object.assign({}, process.env, { NODE_ENV: 'test', PORT: String(PORT), MONGODB_URI: MONGO, JWT_SECRET: 'y'.repeat(48), MOCK_CTRL_PORT: String(PORT + 100), SMTP_HOST: '', SMTP_USER: '', SMTP_PASS: '' },
  withRzp ? { RAZORPAY_KEY_ID: 'rzp_test_x', RAZORPAY_KEY_SECRET: 's' } : { RAZORPAY_KEY_ID: '', RAZORPAY_KEY_SECRET: '' });
let pass = 0, fail = 0; const ok = (c, m) => { c ? pass++ : fail++; console.log(c ? '  ✓' : '  ✗ FAIL:', m); };
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const mongoose = require(path.join(ROOT, 'node_modules/mongoose')); await mongoose.connect(MONGO); await mongoose.connection.dropDatabase();
  spawnSync('node', ['server/scripts/seed-products.js'], { cwd: ROOT, env: ENV });
  // make the DB price differ from the hard-coded storefront price to prove the UI follows the server
  await mongoose.connection.db.collection('products').updateOne({ name: 'Witty Fox 60W Soldering Iron' }, { $set: { price: 175 } });
  const srv = spawn('node', ['-r', './tests/mock-razorpay.js', 'server.js'], { cwd: ROOT, env: ENV }); let log = ''; srv.stderr.on('data', d => log += d); srv.stdout.on('data', d => log += d);
  for (let i = 0; i < 50; i++) { try { if ((await (await fetch(`http://127.0.0.1:${PORT}/api/health`)).json()).database === 'connected') break; } catch (_) {} await sleep(200); }
  const errors = []; const vc = new VirtualConsole(); vc.on('jsdomError', e => { if (!/fonts\.googleapis/.test(e.message)) errors.push(e.message); }); // Google Fonts is just offline in CI vc.on('error', e => errors.push(String(e)));
  try {
    const base = `http://127.0.0.1:${PORT}/`;
    const dom = await JSDOM.fromURL(base, { runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true, virtualConsole: vc,
      beforeParse(w) { w.fetch = (u, o) => fetch(new URL(u, base), o); w.matchMedia = w.matchMedia || (() => ({ matches: false, addEventListener() {}, addListener() {} })); w.scrollTo = () => {}; w.HTMLElement.prototype.scrollIntoView = () => {}; } });
    const w = dom.window, d = w.document; await sleep(2500);
    console.log('\n[frontend] page load' + (withRzp ? ' (Razorpay configured)' : ' (Razorpay NOT configured)'));
    ok(errors.length === 0, 'no JavaScript errors while loading' + (errors.length ? ': ' + errors[0] : ''));
    ok(d.querySelectorAll('.prod').length >= 50, 'product cards rendered: ' + d.querySelectorAll('.prod').length);
    const card = [...d.querySelectorAll('.prod')].find(c => c.querySelector('h3') && c.querySelector('h3').textContent === 'Witty Fox 60W Soldering Iron');
    ok(card && /175/.test(card.querySelector('.price').textContent), 'card price follows server price (175, was hard-coded 164): ' + (card && card.querySelector('.price').textContent));
    ok(w.PR['Witty Fox 60W Soldering Iron'] === 175, 'cart pricing uses the server price too');
    ok(w.esc('"><img src=x onerror=1>\'') .indexOf('<') < 0 && w.esc('"').indexOf('"') < 0, 'esc() now escapes quotes and angle brackets');
    ok(w.CFG.RZP_KEY === (withRzp ? 'rzp_test_x' : ''), 'CFG.RZP_KEY reflects server config: "' + w.CFG.RZP_KEY + '"');
    w.cart = { 'SG90 Micro Servo Motor 9g': 1 }; w.account = { name: 'T', email: 't@e.com', role: 'customer' };
    const html = w.checkoutHTML(); const hasOnline = /value="online"/.test(html);
    ok(hasOnline === withRzp, 'checkout offers "Online payment" only when Razorpay is configured (offered=' + hasOnline + ')');
    ok(/Cash on Delivery/.test(html), 'checkout always offers Cash on Delivery');
    ok(typeof w.flushCartServer === 'function', 'flushCartServer exists');
  } catch (e) { fail++; console.log('CRASH', e.stack); } finally { srv.kill(); await mongoose.disconnect(); }
  console.log(`\n${pass} passed, ${fail} failed`); if (fail) console.log(log.slice(-800)); process.exit(fail ? 1 : 0);
})();
