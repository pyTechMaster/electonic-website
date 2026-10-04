const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  phone: { type: String, trim: true },
  addresses: [{ label: String, name: String, phone: String, address: String, city: String, pin: String }],
  wishlist: [{ type: String }],
  emailVerified: { type: Boolean, default: true },
  emailVerificationTokenHash: { type: String, default: null },
  emailVerificationExpiresAt: { type: Date, default: null },
  passwordResetTokenHash: { type: String, default: null },
  passwordResetExpiresAt: { type: Date, default: null },
  lastLoginAt: { type: Date, default: null },
  loginCount: { type: Number, default: 0 }
}, { timestamps: true });
module.exports = mongoose.model('User', userSchema);
