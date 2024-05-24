const mongoose = require("mongoose");

const RegistrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now // Use the server's current time
  }
});

// Ensure index for email is unique
RegistrationSchema.index({ email: 1 }, { unique: true });

const RegistrationModel = mongoose.model("registration", RegistrationSchema);
module.exports = RegistrationModel;
