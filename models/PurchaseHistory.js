const mongoose = require("mongoose");

const PurchaseHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      name: String,
      quantity: Number,
      price: Number,
      totalPrice: Number,
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const PurchaseHistoryModel = mongoose.model("PurchaseHistory", PurchaseHistorySchema);
module.exports = PurchaseHistoryModel;
