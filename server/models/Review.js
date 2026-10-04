const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
  productName: { type: String, required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true, trim: true, maxlength: 1000 },
  verifiedPurchase: { type: Boolean, default: true }
}, { timestamps: true });
reviewSchema.index({ productName: 1, userId: 1 }, { unique: true });
module.exports = mongoose.model('Review', reviewSchema);
