const mongoose = require("mongoose");

const NewsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure index for email is unique
NewsletterSchema.index({ email: 1 }, { unique: true });

const NewsletterModel = mongoose.model("newsletter", NewsletterSchema);
module.exports = NewsletterModel;
