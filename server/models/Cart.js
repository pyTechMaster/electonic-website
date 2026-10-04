const mongoose = require('mongoose');
const cartItemSchema = new mongoose.Schema({ name: { type: String, required: true }, quantity: { type: Number, required: true, min: 1, max: 9999 } }, { _id: false });
const cartSchema = new mongoose.Schema({ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true }, items: [cartItemSchema] }, { timestamps: true });
module.exports = mongoose.model('Cart', cartSchema);
