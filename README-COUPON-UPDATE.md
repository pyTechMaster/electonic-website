# Tinkerleaf Phase 11: Coupon system

## Customer side (checkout)
* In **Checkout** a new "Have a coupon code?" box appears above the order summary. The customer types the code and taps **Apply**.
  The summary then shows the coupon line (for example `Coupon DIWALI15  − ₹300`) and the new total. **Remove** takes it off.
* The customer must be signed in to apply a coupon (same as placing an order).
* If the cart changes after a coupon was applied, the coupon is cleared and must be applied again.
* The coupon also appears on the order tracking page, the invoice PDF, the order emails and the WhatsApp / Google Sheet order message
  (new fields `coupon` and `discount`; add those two columns in `order-sheet-setup.gs` if you want them in the sheet).

## Admin side: new "Coupons" tab (public/admin.html)
* **+ Create Coupon** with: code, type (Percent % or Flat ₹), value, max discount (percent coupons only, 0 = no cap),
  minimum cart value, total uses allowed (0 = unlimited), uses per customer (0 = unlimited, default 1), start date, expiry date, note.
* The list shows code, discount, min order, used / limit, validity and status (Active, Disabled, Expired, Scheduled, Used up).
* **Disable (band)** switches a coupon off instantly (and **Enable** switches it on again). **Delete** removes it permanently
  (orders already placed with it keep their discount).
* Orders in the admin Orders tab show the coupon code and discount.

## How the discount is calculated (all on the server)
* Subtotal − coupon discount + delivery = total.
* Free delivery is decided on the cart value **before** the coupon (orders of ₹1000+ still get free delivery).
* A discount can never be more than the cart value. Percent coupons are rounded down to whole rupees.
* The browser only sends the coupon *code*. The server re-checks the coupon (active, dates, minimum order, limits) and works out the
  discount every time: when creating the Razorpay payment, when verifying it, and when saving the order. A customer cannot change the discount.
* Online payment: the Razorpay amount is the discounted amount. If the coupon stops being valid after the customer paid
  (switched off, limit reached), the order is refused and the payment is refunded automatically.
* Usage limits are safe against two customers using the last coupon at the same time.
* Cancelling an order gives the coupon use back (the used count goes down and the customer can use it again).

## Files changed
* NEW `server/models/Coupon.js`
* `server/models/Order.js` (new fields `discount`, `couponCode`)
* `server.js` (coupon checks, `POST /api/coupons/validate`, admin API `GET/POST /api/admin/coupons`, `PATCH/DELETE /api/admin/coupons/:id`, invoice, emails, cancel)
* `public/script.js` (checkout coupon box, totals, order messages, track page), `public/admin.html` (Coupons tab), `public/sw.js` (cache version)
* Tests: `tests/e2e.test.js` (new section 12, Coupons) and `tests/frontend.test.js` (checkout coupon flow)

No new npm package and no manual database step: the `coupons` collection is created automatically. Extract, `npm install`, start.
