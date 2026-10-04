const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, min: 0 },
  stock: { type: Number, default: 0, min: 0 },
  category: String,
  brand: String,
  image: String,
  description: String
}, { timestamps: true });
module.exports = mongoose.model('Product', productSchema);
