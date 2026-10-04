require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const products = require('../products.json');
// Safe to re-run: price/name/category are refreshed, but STOCK is only set the first time a product is created,
// so re-seeding never resets your live stock back to 100.
(async () => {
  if (!process.env.MONGODB_URI) { console.error('Add MONGODB_URI to .env first'); process.exit(1); }
  await mongoose.connect(process.env.MONGODB_URI);
  let created = 0, updated = 0;
  for (const p of products) {
    const { stock, ...rest } = p;
    const r = await Product.updateOne({ name: p.name }, { $set: rest, $setOnInsert: { stock: stock ?? 0 } }, { upsert: true });
    if (r.upsertedCount) created++; else updated++;
  }
  console.log(`Products: ${created} created, ${updated} updated (existing stock left untouched). Total in file: ${products.length}`);
  await mongoose.disconnect();
})().catch(e => { console.error(e.message); process.exit(1); });
