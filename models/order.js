// models/Order.js
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      title: String,
      price: Number,
      discountedPrice: Number,
      quantity: Number,
      previewImg: { type: String } // رابط الصورة

      
    }
  ],
  customerInfo: {
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true }
},
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", OrderSchema);