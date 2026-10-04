const mongoose = require('mongoose');
const paymentAttemptSchema = new mongoose.Schema({
  idempotencyKey: { type: String, required: true, unique: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  razorpayOrderId: { type: String, required: true, unique: true, index: true },
  razorpayPaymentId: { type: String, default: null },
  paymentId: { type: String, default: null },
  amountPaise: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'INR' },
  status: { type: String, default: 'created' },
  webhookStatus: { type: String, default: null },
  webhookEvent: { type: String, default: null },
  lastWebhookAt: { type: Date, default: null },
  verifiedAt: { type: Date, default: null },
  orderCreated: { type: Boolean, default: false },
  refundedAt: { type: Date, default: null },
  refundId: { type: String, default: null },
  refundError: { type: String, default: null }
}, { timestamps: true });
module.exports = mongoose.model('PaymentAttempt', paymentAttemptSchema);
