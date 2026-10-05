const mongoose = require('mongoose');
const itemSchema = new mongoose.Schema({ name: String, quantity: Number, price: Number }, { _id: false });
const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true, required: true },
  idempotencyKey: { type: String, unique: true, sparse: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  items: [itemSchema],
  subtotal: Number,
  delivery: Number,
  discount: { type: Number, default: 0 },
  couponCode: { type: String, default: '' },
  total: Number,
  customer: { name: String, phone: String, email: String, address: String, city: String, pin: String, business: String, gstin: String },
  paymentMethod: { type: String, enum: ['cod', 'online'], default: 'cod' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  paymentId: { type: String },
  razorpayOrderId: String,
  razorpaySignature: String,
  refund: { status: { type: String, enum: ['none', 'done', 'failed'], default: 'none' }, refundId: String, amountPaise: Number, at: Date, error: String },
  courier: String,
  trackingNumber: String,
  status: { type: String, enum: ['placed', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'], default: 'placed' },
  statusHistory: [{ status: { type: String }, note: String, at: { type: Date, default: Date.now } }],
  cancelRequest: { requested: { type: Boolean, default: false }, reason: String, requestedAt: Date },
  returnRequest: {
    requested: { type: Boolean, default: false },
    reason: String,
    items: [String],
    requestedAt: Date,
    status: { type: String, enum: ['none','requested','approved','rejected','refunded'], default: 'none' },
    note: String
  }
}, { timestamps: true, autoIndex: false });
// Sparse + unique only skips orders where paymentId is ABSENT. The old code stored '' for COD orders, and '' counts as a
// real value, so the 2nd COD order hit a duplicate-key error. Now COD orders simply have no paymentId (see server.js).
// Indexes are synced once at startup (autoIndex is off so the app can first clean up old '' values).
orderSchema.index({ paymentId: 1 }, { unique: true, sparse: true });
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ razorpayOrderId: 1 });
module.exports = mongoose.model('Order', orderSchema);
