# Tinkerleaf Phase 6 — Payment & Production Security

Implemented:
- Razorpay server-side amount calculation and live payment amount/status verification.
- Razorpay webhook signature verification with duplicate-event protection.
- Payment-attempt idempotency to prevent duplicate Razorpay orders and duplicate order creation.
- Atomic stock decrement (`stock >= quantity`) so concurrent checkouts cannot drive stock negative.
- Automatic stock compensation and Razorpay refund attempt when order creation fails after a captured payment.
- Admin routes remain protected by database-backed admin role checks; login rate limiting applies to admin login as well.
- Frontend only shows order success after the backend successfully saves the order.

## Required production setting
Set `RAZORPAY_WEBHOOK_SECRET` in `.env` to the exact webhook secret configured in the Razorpay Dashboard. Configure the webhook URL as:

`https://YOUR-DOMAIN/api/webhooks/razorpay`

Recommended events: `payment.captured` and `payment.failed`.

Run `npm install` after extracting the project, then `npm start`. Test all payment flows in Razorpay Test Mode before live payments.
