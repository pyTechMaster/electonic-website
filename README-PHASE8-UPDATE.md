# Tinkerleaf Phase 8 — Accounts, user records, install-as-app

Built on top of Phase 7. Edit website files only in `public/`.

## 1. Account flow (already worked in Phase 7, kept as is)
Create account → (verify email) → sign in → place order. Ordering is blocked until the customer is signed in
(both on the website and on the server: `POST /api/orders` needs a login).

## 2. Returning customers & forgot password
* A customer who signs out can sign in again with the same email + password. **No new account is needed.** The login also
  stays active for 7 days on the same device.
* "Forgot password?" on the sign-in box e-mails a reset link (valid 30 minutes). This needs SMTP in `.env`.
* NEW `REQUIRE_EMAIL_VERIFICATION=false` in `.env`: use it if SMTP is not set up yet, otherwise new customers on a live
  server cannot verify their e-mail and therefore cannot sign in.

## 3. Record of registered users (NEW)
* The database now also stores `lastLoginAt` and `loginCount` for every customer (`createdAt` = sign-up date, already there).
* **Admin page → top cards:** Registered users, New sign-ups today (Indian time), Last 7 days, Last 30 days, Verified accounts.
* **Admin page → "Users" tab:** list of every customer (name, e-mail, joined, last login, logins, orders, verified or not),
  with search. **Download CSV** button saves the full list for Excel / Google Sheets.
* API (admin only): `GET /api/admin/users?q=&limit=&skip=`, `GET /api/admin/users.csv`, and `GET /api/admin/stats` now also returns
  `verifiedUsers, usersToday, users7d, users30d`.
* Customers that registered before this update appear with an empty "Last login" until they sign in again.

## 4. Install as an app + notifications (NEW)
* `public/sw.js` (service worker) + new `site.webmanifest` make the site installable (Android Chrome, desktop Chrome/Edge, iPhone via Safari).
* Where customers see it:
  * a banner after a few seconds ("Install the Tinkerleaf app") — "Not now" hides it for 7 days;
  * side menu → **📲 Install Tinkerleaf App** and **🔔 Turn on notifications**;
  * footer → **📲 Install App**.
  * iPhone/Safari cannot show a one-tap prompt, so the banner explains: Share → *Add to Home Screen*.
* Notifications: when a customer allows notifications they get a confirmation, an "app installed" message, and at most one
  "Install the app" reminder per week. Inside the installed app, notifications are offered once.
* Needs **HTTPS** on the live domain (works on `localhost` for testing). Install is not offered on plain `http://` hosting.
* The service worker never caches `/api/*`, admin or payment pages; pages/scripts are loaded from the network first so updates arrive normally.

### Not included (needs more setup)
Server-sent push notifications (order status / offers while the app is closed) need push keys (VAPID), a `web-push` package and a
table of subscriptions. This update shows system notifications from the open website/app only.

## Upgrade steps
1. Extract, `npm install`, start. No database migration is needed.
2. Optional: add `REQUIRE_EMAIL_VERIFICATION=false` to `.env` (see above).
3. Open the live site once, then check Chrome DevTools → Application → Manifest / Service Workers.
