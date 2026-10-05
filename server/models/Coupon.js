const mongoose = require('mongoose');
// One discount coupon. Created / disabled / deleted from the admin panel (Coupons tab).
const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  description: { type: String, default: '', trim: true, maxlength: 200 },
  type: { type: String, enum: ['percent', 'flat'], required: true },
  value: { type: Number, required: true, min: 1 },          // percent (1-100) or rupees
  maxDiscount: { type: Number, default: 0, min: 0 },        // cap for percent coupons, 0 = no cap
  minOrder: { type: Number, default: 0, min: 0 },           // minimum cart subtotal, 0 = none
  startsAt: { type: Date, default: null },
  expiresAt: { type: Date, default: null },
  usageLimit: { type: Number, default: 0, min: 0 },         // total uses allowed, 0 = unlimited
  perUserLimit: { type: Number, default: 1, min: 0 },       // uses per customer, 0 = unlimited
  usedCount: { type: Number, default: 0, min: 0 },
  active: { type: Boolean, default: true }
}, { timestamps: true });
module.exports = mongoose.model('Coupon', couponSchema);
