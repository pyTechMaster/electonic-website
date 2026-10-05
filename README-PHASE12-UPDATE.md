# Tinkerleaf Phase 12: card price fix, coupon edit, order sheet columns

## 1. Card price bug (public/script.js)
Problem: admin panel mein product ka price (ya MRP) badalne par shop ke product cards par purana price, purana "Sale %" aur
purana "Save Rs" dikhta tha, jabki cart / product page / checkout mein naya price aata tha.
Karan: server se naya price `PR` mein aa jata tha, lekin shop catalogue (`CAT`) ki purani price se cards dobara ban jaate the.
Fix:
* `TLshop.refresh()` ab pehle `CAT` ko naye `PR` / `OP` se sync karta hai, phir cards draw karta hai.
* `loadServerStock()` ab server ka `originalPrice` (MRP) bhi leta hai.
* `applyPrices()` ab price, struck-through MRP, Sale % badge aur Save line - sab update karta hai (MRP price se kam/barabar ho to hata deta hai).

## 2. Coupon edit (public/admin.html)
* Coupons list mein har coupon ke saath naya **Edit** button. Form mein sab fields (type, value, max, min order, limits, dates, note) badal sakte hain.
* Coupon **code** badla nahi ja sakta (box locked rehta hai). Server ka `PATCH /api/admin/coupons/:id` pehle se edit support karta tha, server.js mein badlav nahi.

## 3. Order sheet columns (order-sheet-setup.gs)
* Orders sheet mein 2 naye columns, sabse end mein: **Coupon** aur **Discount**. Owner email mein bhi coupon line aati hai.
* Purani sheet par kuch karna nahi: pehla naya order aate hi header row mein naye columns apne aap jud jaate hain.
* ZAROORI: Apps Script mein naya code paste karke Deploy > Manage deployments > Edit > New version > Deploy karein.

## Other
* `public/sw.js` cache version tl-v9 -> tl-v10 (taaki visitors ko nayi script mile).
* Koi naya npm package ya database step nahi.
