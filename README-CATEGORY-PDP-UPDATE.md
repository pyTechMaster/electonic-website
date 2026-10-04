# Tinkerleaf Phase 10: categories + product page

## 1. Category / sub-category system (script.js, shop block: TAX and RULES)
* Main categories: Components, Boards & Modules, Tools, Displays, Drones, 3D printing, STEM kits (plus Bestsellers / All / New launches).
* Click a category and sub-category chips appear (Components: Resistors, Capacitors, LEDs, Sensors, ICs, Wires & jumpers; Boards: Arduino, ESP32 & ESP8266, Raspberry Pi, Relay modules, Motors & drivers; Tools: Soldering, Multimeter, Wire tools, Screwdrivers & pliers, Measuring & power ...). A sub-category with no product (for example ICs today) stays hidden and appears automatically when a product matches.
* Filters from Phase 9 (brand, price, in stock, sort) work inside every category / sub-category.
* Products are placed by name using the `RULES` list in script.js (first match wins). New product that lands in the wrong place: add one line to `RULES`.
* Menu "Shop By Category", footer links and the product-page breadcrumb use links like `#cat=boards/arduino`.
* Search also understands category words (try "resistor", "relay", "sensors", "boards").

## 2. Product page
* Breadcrumb, rating under the title, stock status ("Only 3 left" when stock is 5 or less).
* Photo gallery with thumbnails (hover / touch zoom kept). Add more photos in script.js: `PIMGS["Exact product name"]=["images/x.webp","images/y.webp"]`.
* Estimated delivery by PIN code (rules in `DELIVERY`, edit to match your courier).
* Rating summary (average + 5-star bars; server `/api/reviews` now also returns `distribution`).
* Frequently bought together: 2 suggested items with tick boxes, total and "Add selected to cart" (rules in `FBT_RULES`).
* Share button (phone share sheet, otherwise copies the link). Wishlist, specifications, related products and reviews were already there and are kept; related products now also use category / sub-category.

No database change, no new package.
