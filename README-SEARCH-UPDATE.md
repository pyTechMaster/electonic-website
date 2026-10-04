# Tinkerleaf Phase 9: better search & filters

Shop section (`public/script.js` shop v5 block, `index.html` shopbar, `style.css`) now has:
* Search by product name, category keyword (drone, 3d printer, stem, display...) and brand (Arduino, Raspberry Pi, Bambu Lab, Holybro, ...).
  Brand is detected from the product name (list `BRANDS` in script.js; add new brands there). Others show as "Other".
* Filters: Brand, Price range (min / max), In stock only, Category (shown while searching). "Reset filters" clears all.
  Filters work with normal browsing too, not only with search. On phones they open from the "Filters" button.
* Sort: Featured / Best match, Price low to high, Price high to low, Newest, Popular, Biggest discount, Name A to Z.
  * Newest = New launches first, then the date the product was added in the database.
  * Popular = units sold in non-cancelled orders (new API `GET /api/products/popularity`, cached 5 min), then bestseller order.
* In stock uses `stock.js` (OUT_OF_STOCK) and the database stock, same as the product cards.

No database change, no new npm package. Extract, `npm install`, start.
