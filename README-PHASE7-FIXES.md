# Tinkerleaf Phase 7 — Review, bug fixes & hardening

## IMPORTANT: where to edit the website files
The website lives **only in `public/`** (`public/script.js`, `public/index.html`, `public/style.css`, …).
Old copies at the project root (a stale `script.js`, `index.html`, `images/` …) were removed because the server never served
them and they had already drifted out of sync. Edit `public/` only. (README-SETUP.txt says "script.js" = `public/script.js`.)

## Bugs fixed
| # | Problem | Fix |
|---|---------|-----|
| 1 | **Only the first Cash-on-Delivery order could ever be saved.** COD orders stored `paymentId: ""`, and the unique index treats `""` as a real value, so the 2nd COD order failed with a duplicate-key error. | COD orders store no `paymentId`. Startup removes old `""` values. |
| 2 | **Order IDs came from the browser** (collisions → real paid orders refunded; and a customer could inject script into the *admin* page through the order id). | Server generates the order id. Admin page no longer builds inline JS from data. |
| 3 | Double-click / retry could create two orders, or refund a payment that already had an order. | Race-safe idempotency; a retry returns the existing order. |
| 4 | Paid online order cancelled → **no refund**, `paymentStatus` could not even say "refunded". | Cancelling (customer or admin) restores stock once and refunds via Razorpay automatically. Added `refunded` status + refund record. |
| 5 | Admin "cancelled" didn't restore stock; admin could move orders backwards/revive cancelled ones; return "refunded" didn't refund. | Status flow enforced; admin cancel = same safe path; return "refunded" really refunds online orders. |
| 6 | Customer paid but closed the tab / network dropped before the order was saved → **money taken, no order**. | Webhook records the payment; a background job auto-refunds orphan payments after `ORPHAN_REFUND_AFTER_MINUTES` (default 30). The browser also retries saving the order 3×. |
| 7 | "Online payment" was shown even when Razorpay was not configured → customer pays by QR, then the server rejects the order. | Online option only appears when Razorpay is configured. |
| 8 | Cart was synced to the server with a delay; a fast checkout could be priced from an old cart. | Cart is flushed to the server before payment/order. Place-order button locks to stop double submits. |
| 9 | Catch-all route pointed to a root `index.html` (only worked because of the duplicate), and unknown `/api/...` URLs returned HTML. | Serves `public/index.html`; unknown API paths return JSON 404; bad JSON returns JSON 400. |
| 10 | `seed-products` reset **stock to 100 every time** it was run. | Stock is set only when a product is first created. |
| 11 | `create-admin -- email pass` ignored the email you typed if `ADMIN_EMAIL` was in `.env`. | Command-line values win. |
| 12 | Invoice PDF printed the ₹ sign as garbage (built-in PDF font has no ₹). | Uses `Rs.`; optional `BUSINESS_GSTIN` shown. |
| 13 | Prices edited in Admin were charged by the server but the website still showed the old hard-coded price. | Storefront now loads live prices from the database. |
| 14 | `esc()` didn't escape quotes (attribute injection). | Fixed in site and admin. |
| 15 | Webhook event was marked "done" before processing (a failure lost it). | Marked after processing; Razorpay retries on failure. |
| 16 | Local development without SMTP: new accounts could never verify and never log in. | In non-production, accounts auto-verify when SMTP is not set. |
| 17 | Admin could pass any field to product create/update; no limits on register/resend; JWT_SECRET never validated; logout cookie flags; rate limit behind proxies. | Whitelisted fields, rate limits, JWT secret check (hard fail in production), `TRUST_PROXY` setting. |
| 18 | `nodemailer` 7 had known security advisories (`npm audit`: 1 high). | Upgraded to 10.x — `npm audit` is clean. |

## Before going live (action needed from you)
1. `npm install`, then start once — it repairs the `paymentId` index automatically.
2. Set in `.env` on the server: `NODE_ENV=production`, a real `JWT_SECRET` (32+ chars), `TRUST_PROXY=1` if behind a host proxy.
3. Razorpay Dashboard → Webhooks: URL `https://YOUR-DOMAIN/api/webhooks/razorpay`, events `payment.captured`, `payment.failed`, same secret as `RAZORPAY_WEBHOOK_SECRET`.
4. In Razorpay settings keep **payment auto-capture ON** (the server only accepts `captured` payments).
5. Test one COD order, one online order, one cancel-with-refund in Razorpay **Test Mode**.

## Tests
`npm test` runs 69 server checks + 9 storefront checks against a throw-away database. **It wipes that database**, so it only runs with
`TEST_MONGODB_URI` pointing to a DB whose name contains `test`, `e2e` or `tl_` (default: local `mongodb://127.0.0.1:27017/tl_e2e`).
