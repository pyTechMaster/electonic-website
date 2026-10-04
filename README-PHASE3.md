# Tinkerleaf Phase 3

Added:
- Razorpay server-side order creation + signature verification
- Customer/admin email order notifications through SMTP
- Product reviews with verified-purchase protection

## Setup

1. Extract the project.
2. In the project folder run:

```powershell
npm install
```

3. Copy `.env.example` to `.env`.
4. Keep your existing `MONGODB_URI` and `JWT_SECRET`.
5. For Razorpay, add **test** credentials first:

```text
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
```

Never put the Razorpay secret in frontend JavaScript.

6. For email, configure SMTP. With Gmail, use a Google App Password rather than your normal account password:

```text
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
MAIL_FROM="Tinkerleaf <your-email@gmail.com>"
ADMIN_EMAIL=your-email@gmail.com
```

7. Start:

```powershell
npm start
```

## Razorpay flow

Checkout creates a Razorpay order on the backend, opens Razorpay Checkout, verifies the returned signature on the backend, and only then allows the Tinkerleaf order to be stored as paid.

Without Razorpay keys, the existing non-Razorpay online/UPI fallback remains available.

## Email flow

After an order is stored, Tinkerleaf sends an order confirmation email to the customer's checkout email (if supplied) and to `ADMIN_EMAIL`. When an admin changes order status, the customer receives a status-update email if an email address exists.

## Reviews

Customers can read reviews on each product page. A customer can submit/update a review only after Tinkerleaf has an order for that account containing the product and the order status is `delivered`. Each customer has one review per product.


## Phase 4 — Customer essentials

Added in this update:

- **Forgot password:** secure, time-limited reset links sent by SMTP.
- **Email verification:** new customer accounts receive a verification link before first sign-in; existing accounts remain usable.
- **Order cancellation:** customers can cancel while the order is still `placed`, `confirmed`, or `packed`. Stock is restored.
- **Return request:** delivered orders can request a return within 7 days. Admin can approve, reject, or mark a request refunded.
- **Invoice PDF:** customers can download an invoice from order tracking. GST calculation is configurable through `GST_RATE` and `GST_INCLUDED`.
- **Pincode delivery check:** checkout checks the pincode before order placement. `DELIVERY_MODE=all_india` treats valid Indian pincodes as serviceable; switch to `whitelist` and fill `DELIVERY_PINCODES` / `DELIVERY_PIN_PREFIXES` for a real business-specific list.

### New environment settings

See `.env.example` and add the new settings to your `.env`. After updating `package.json`, run:

```powershell
npm install
```

For email verification and password reset, SMTP must be configured.

For the PDF invoice, `pdfkit` is installed by `npm install`. The GST rate is intentionally configurable because GST rates can vary by product/category; verify the rate and invoice requirements applicable to your business before production use.
