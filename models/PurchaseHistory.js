const mongoose = require("mongoose");

// Define PurchaseHistory Schema
const PurchaseHistorySchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true, // Ensures product name is mandatory
    trim: true, // Removes unnecessary spaces
  },
  price: {
    type: Number,
    required: true, // Ensures price is provided
    min: [0, "Price must be a positive value"], // Validation for positive price
  },
  totalAmount: {
    type: Number,
    required: true, // Ensures total amount is mandatory
    min: [0, "Total amount must be a positive value"], // Validation for positive total amount
  },
  date: {
    type: Date,
    default: Date.now, // Automatically sets the current date
  },
});

// Create PurchaseHistory Model
const PurchaseHistoryModel = mongoose.model("PurchaseHistory", PurchaseHistorySchema);

module.exports = PurchaseHistoryModel;
