TINKERLEAF - SETUP GUIDE (Hinglish)
===================================

NOTE (Phase 7): website files ab sirf `public/` folder mein hain (public/script.js, public/index.html ...).
Is file mein jahan "script.js" / "index.html" likha hai, wo public/ ke andar wali file hai. Root par purani copies hata di gayi hain.
Details: README-PHASE7-FIXES.md

Is update mein kya badla
------------------------
1. Order notification: ab har order apne aap aapki Google Sheet mein save hoga
   (aur email bhi aayegi). Customer WhatsApp "Send" na dabaye tab bhi order aap tak pahunchega.
2. Ab order place karne ke liye Tinkerleaf account zaroori hai. Customer ko pehle Sign in / Create account karna hoga; bina account ke checkout aur order API dono block hain.
   Signed-in customer ki last order ki delivery details us ke browser mein yaad rehti hain taaki dobara na likhni padein.
3. Delivery charge ki policy: Rs 1000 ya usse zyada par FREE delivery, uske neeche Rs 60.
   Ye cart, checkout, product page, header/footer, Delivery Policy page, WhatsApp message
   aur UPI payment amount - sab jagah dikhta hai.

Delivery charge badalna
-----------------------
script.js ke bilkul upar CFG mein:
   FREE_ABOVE:1000   -> kitne par free delivery
   SHIP:60           -> usse kam par charge
Sirf ye do numbers badalne se site + policy page + cart sab update ho jate hain.
(Sirf index.html ke 3 chhote text mein "1000" aur "60" likha hai: top bar, trust strip aur footer.
 Agar numbers badlein to index.html mein bhi "Free delivery on ₹1000+" aur "Free on ₹1000+, else ₹60" badal dein.)

ORDER NOTIFICATION SETUP (Google Sheet, free, 5 minute)
--------------------------------------------------------
1. Google Sheet kholein (sheets.google.com) -> naya blank sheet banayein, naam: "Tinkerleaf Orders".
2. Menu: Extensions -> Apps Script.
3. Jo code pehle se likha hai wo delete karein. order-sheet-setup.gs file ka poora code paste karein. Save karein.
4. Code mein OWNER_EMAIL check karein (jis email par order alert chahiye).
5. Deploy -> New deployment -> type: "Web app".
      Execute as: Me
      Who has access: Anyone
   Deploy dabayein, permissions Allow karein (Google "unverified" warning de to Advanced -> Go to project).
6. "Web app URL" copy karein (https://script.google.com/macros/s/.../exec).
7. script.js ke upar CFG mein paste karein:
      ORDER_URL:'https://script.google.com/macros/s/XXXX/exec'
8. Website upload karein aur ek TEST ORDER dein. Sheet mein row aur email aani chahiye.

Formspree use karna ho (sirf email chahiye to):
   formspree.io par form banayein, uska URL (https://formspree.io/f/xxxx) ORDER_URL mein daal dein.

Zaroori baatein
---------------
- Jab tak ORDER_URL khali hai, site purane tareeke se chalegi (WhatsApp khulega). Isliye URL zaroor daalein.
- Website sirf "network gaya ya nahi" dekh sakti hai. Agar URL galat ho to bhi "recorded" dikh sakta hai.
  Isliye deploy ke baad TEST ORDER zaroor dein, aur Apps Script code badalne par "New deployment" karein.
- Agar customer ka internet beech mein chala jaye to order uske browser mein save rehta hai aur
  net aane par apne aap dobara bheja jata hai. Sheet mein duplicate nahi banta.
- Product ke "WhatsApp" buttons ab "Ask on WhatsApp" hain (sirf sawal puchne ke liye), taaki
  order sirf cart/checkout se aaye aur record ho.
- Online UPI payment ka UTR sheet mein "UTR" column mein aata hai. Bank/UPI app mein verify karke
  Sheet ke "Status" column mein Confirmed/Dispatched likh sakte hain.
- Ye security ke liye "asli" payment verification nahi hai. UTR customer khud type karta hai, isliye
  dispatch se pehle payment apne UPI app mein dekh lein.


=====================================================================
UPDATE v8: STOCK STATUS + RAZORPAY
=====================================================================

A) STOCK (In stock / Out of stock)
----------------------------------
- stock.js file kholein. OUT_OF_STOCK list mein product ka naam (bilkul site jaisa) daalein, jaise:
      var OUT_OF_STOCK = [ "Raspberry Pi 3B+", "Digital Multimeter" ];
- Wapas stock aane par naam hata dein. File upload karte hi site update.
- Out of stock product par: red "Out of stock" badge, button disabled, product page par "Out of stock"
  aur "Ask when back in stock" (WhatsApp). Cart mein aisa product add nahi hoga, aur checkout/payment
  se pehle bhi dobara check hota hai (agar customer ke cart mein pehle se tha to hata diya jata hai).
- Agar naam galat likha ho to browser console mein warning aati hai ("stock.js: product naam match nahi hua").
- Limitation: stock sirf aapki list se chalta hai, quantity count nahi hota (10 bike, 3 bike nahi).
  Automatic quantity count ke liye backend/inventory sheet chahiye.

B) RAZORPAY (automatic payment verification)
--------------------------------------------
Pehle Razorpay account banayein aur KYC poora karein (razorpay.com). Test mode mein pehle try karein.
1. Razorpay Dashboard -> Account & Settings -> API Keys -> Generate Key. Do cheezein milengi:
      Key ID (rzp_test_... / rzp_live_...)   -> public hai, website mein jaata hai
      Key Secret                              -> SECRET hai, website mein KABHI mat daalein
2. Settings -> Payment Capture: "Automatic" rakhein (warna payment sirf "authorized" rehti hai).
3. Google Apps Script (jis project mein order-sheet-setup.gs hai) mein naya code paste karein.
   Project Settings (gear icon) -> Script properties -> Add:
      RZP_KEY_ID      = aapki Key ID
      RZP_KEY_SECRET  = aapka Key Secret
4. Deploy -> Manage deployments -> Edit (pencil) -> Version: "New version" -> Deploy.
   (URL wahi rahega. Agar naya deployment banaya to naya URL script.js mein daalna hoga.)
   Pehli baar Google naya permission (external requests) maangega, Allow karein.
5. script.js ke upar CFG mein Key ID daalein:
      RZP_KEY:'rzp_test_xxxxxxxx'
   (ORDER_URL bhi bhara hona zaroori hai.)
6. Test mode mein test order dein (Razorpay ke test card/UPI se). Sheet ke "Payment check" column mein
   "PAID & VERIFIED" aana chahiye.
7. Sab sahi ho to test key hata kar live key daalein.

Kaise kaam karta hai: customer Razorpay ke popup mein UPI/card/netbanking se pay karta hai. Payment ke
baad order Sheet mein save hota hai aur Apps Script Razorpay se payment ki asli status check karke
"Payment check" column mein likhta hai: PAID & VERIFIED / MISMATCH / NOT PAID / DUPLICATE.
Ab customer ko UTR type nahi karna padta. Jab RZP_KEY khali ho, purana UPI QR + UTR tareeka chalta rahega.

Payment verification ke baare mein sach:
- Dispatch SIRF "PAID & VERIFIED" wale order ka karein.
- Agar customer payment karke popup se pehle browser band kar de, to payment Razorpay dashboard mein
  dikhegi (order id, naam, phone, items notes mein) lekin Sheet mein row nahi aayegi. Dashboard bhi check karte rahein.
  Isko poori tarah band karne ke liye Razorpay webhook + server chahiye (agla step).
- Order ka Total customer ke browser se aata hai. Apps Script check karta hai ki Razorpay mein utna hi
  amount mila jitna Total hai, par ye nahi dekhta ki Total sahi price list se bana hai ya nahi.
  Koi technical customer browser mein chhedchhad kar ke kam price se pay kar sakta hai. Dispatch se pehle
  Items aur Total ek baar dekh lein. Poori suraksha ke liye price server par rakhna padega.
- Razorpay ki fees lagti hain (roughly 2% + GST). Chahein to COD ko hi default rakhein.

=====================================================================
UPDATE v9: FAVICON, TERMS & CONDITIONS + GST, QUOTATION FORM
=====================================================================

A) FAVICON
- Site ke leaf logo se bana hai: favicon.svg, favicon.ico, apple-touch-icon.png, icon-192.png,
  icon-512.png aur site.webmanifest. Sab index.html ke <head> mein jude hain. Inhe site ke saath
  usi folder mein upload karein. (Browser purana icon cache kar leta hai, tab mein dikhne mein thoda time lag sakta hai.)
- Phone par "Add to Home Screen" karne par bhi ye icon dikhega.

B) TERMS & CONDITIONS + GST / INVOICE
- Naya page: #pg=terms. Link: footer (2 jagah), menu, aur checkout ke "Place order" ke neeche.
- script.js ke CFG mein GSTIN:'24XXXXXXXXXXXXX' daalein (agar GST registered hain). Tab ye Terms page
  aur footer mein dikhega. Khali rakhein to GSTIN kahin nahi dikhega.
- Checkout mein optional "Need a GST invoice?" section aaya hai (business ka naam + GSTIN). GSTIN ka format check
  hota hai. Ye WhatsApp message, Google Sheet ("GST invoice" column) aur email mein aata hai.
- Privacy Policy bhi update hui: purane "account / sign out" wale shabd hataye, Razorpay aur quotation ka zikr joda.
- ZAROORI: Terms ka text ek aam template hai. Isme ye baatein likhi hain, inhe check karein ki aapke business par sach hain:
     * "Prices include applicable taxes"
     * "Hum har order ke saath bill / invoice dete hain"
     * "GST invoice dispatch se pehle batana hoga"
     * Ahmedabad courts ka jurisdiction, aur liability order ki value tak limited
  Jo galat ho use script.js mein "terms:[" wale hisse mein badal dein. Launch se pehle kisi CA/vakil se ek baar dikhwa lein.

C) QUOTATION FORM
- "Get a Quotation" ab form kholta hai (#pg=quote): naam, organisation, phone, email (optional),
  products + quantity (10 tak, product naam suggest hote hain, kuch bhi likh sakte hain), aur notes.
- ORDER_URL set hai to request Google Sheet ke naye "Quotes" tab mein jati hai aur aapko email aati hai.
  Customer ko "Request received" dikhta hai. Net na ho to khud dobara bheji jati hai.
- ORDER_URL khali hai to form WhatsApp message bana kar kholta hai (purane jaisa).
- Spam bots ke liye chhupa hua honeypot field hai.
- Apps Script ka naya code (order-sheet-setup.gs) paste karke Deploy > Manage deployments > Edit >
  New version karna zaroori hai, warna quotation Sheet mein nahi aayegi.
  Pehle se bani Orders sheet mein naya column (GST invoice) apne aap jud jata hai.

--- TINKERLEAF REAL BACKEND + DATABASE ---
This package now includes a Node.js + Express backend and MongoDB integration.
See README-BACKEND.md for setup.

Quick start:
1. Open Command Prompt in this folder.
2. Run: npm install
3. Copy .env.example to .env and add your MongoDB Atlas connection string and JWT_SECRET.
4. Run: npm run seed-products
5. Run: npm run create-admin -- admin@example.com StrongPassword123
6. Run: npm start
7. Open http://localhost:3000
8. Admin: http://localhost:3000/admin.html


=====================================================================
UPDATE v10: MY ORDERS + TRACK ORDER PAGES
=====================================================================
Naye pages (account me sign in zaroori, kyunki order sirf owner ko dikhta hai):
  #pg=orders          -> "My orders": saare orders (newest first), filter: All / In progress / Delivered / Cancelled
  #pg=track           -> "Track your order": Order ID daalkar status timeline dekhein
  #pg=track/TL1234... -> kisi order ka seedha tracking link

Kahan se khulte hain:
- Header nav me "Orders" dropdown (My orders / Track an order)
- Menu (hamburger) me "My Orders" aur "Track Order"
- Account popup ke "My Orders" button se
- Footer ke Support column me
- Order place hone ke baad "Track this order" button

Tracking me: Order placed -> Confirmed -> Packed -> Shipped -> Delivered (cancel hone par "Cancelled").
Shipped par courier ka naam aur tracking number bhi dikhta hai.

Admin (admin.html): order ko "shipped" mark karte waqt ab Courier name aur Tracking number poochta hai
(dono optional). Customer ko ye tracking page aur status email me dikhta hai.

Backend badlav:
- Order model me 2 naye optional fields: courier, trackingNumber
- PATCH /api/admin/orders/:orderId/status ab courier aur trackingNumber bhi leta hai
- /api/orders/my aur /api/orders/:orderId ab razorpaySignature wapas nahi bhejte
Server restart karna hoga (npm start). Naye fields ke liye migration ki zaroorat nahi.
