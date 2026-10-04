// Test helper: replaces the `razorpay` SDK with an in-memory fake and exposes a tiny control API for the tests.
// Used only by tests/e2e.test.js via `node -r ./tests/mock-razorpay.js server.js`.
const Module = require('module'); const http = require('http'); const crypto = require('crypto');
const orders = new Map(), payments = new Map(), refunds = []; let n = 0;
class FakeRazorpay {
  constructor(o) { this.keySecret = o.key_secret;
    this.orders = {
      create: async d => { const id = 'order_' + (++n); const o2 = { id, amount: d.amount, currency: d.currency, receipt: d.receipt, notes: d.notes || {} }; orders.set(id, o2); return o2; },
      fetch: async id => { if (!orders.has(id)) throw new Error('no such order'); return orders.get(id); }
    };
    this.payments = {
      fetch: async id => { if (!payments.has(id)) throw new Error('no such payment'); return payments.get(id); },
      refund: async (id, d) => {
        const p = payments.get(id); if (!p) throw new Error('no such payment');
        if (globalThis.__failRefunds) throw new Error('refund API down');
        if (p.amount_refunded > 0) throw new Error('already refunded');
        p.amount_refunded = d.amount; const r = { id: 'rfnd_' + (++n), payment_id: id, amount: d.amount }; refunds.push(r); return r;
      }
    };
  }
}
const orig = Module._load;
Module._load = function (req, ...a) { return req === 'razorpay' ? FakeRazorpay : orig.call(this, req, ...a); };
const secret = process.env.RAZORPAY_KEY_SECRET;
http.createServer((req, res) => {
  let b = ''; req.on('data', c => b += c); req.on('end', () => {
    const j = b ? JSON.parse(b) : {}; res.setHeader('content-type', 'application/json');
    if (req.url === '/pay') { // simulate the customer paying a Razorpay order
      const o = orders.get(j.order_id); const id = 'pay_' + (++n);
      payments.set(id, { id, order_id: j.order_id, amount: j.amount ?? o.amount, status: j.status || 'captured', amount_refunded: 0 });
      const sig = crypto.createHmac('sha256', secret).update(j.order_id + '|' + id).digest('hex');
      return res.end(JSON.stringify({ razorpay_order_id: j.order_id, razorpay_payment_id: id, razorpay_signature: sig }));
    }
    if (req.url === '/refunds') return res.end(JSON.stringify(refunds));
    if (req.url === '/fail-refunds') { globalThis.__failRefunds = !!j.on; return res.end('{}'); }
    res.statusCode = 404; res.end('{}');
  });
}).listen(Number(process.env.MOCK_CTRL_PORT), '127.0.0.1');
