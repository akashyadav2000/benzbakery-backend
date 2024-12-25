const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();
const cors = require("cors");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const RegistrationModel = require("./models/Registration");
const FeedbackModel = require("./models/Feedback");
const NewsletterModel = require("./models/Newsletter");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONG0_URL);

// mongoose.connect(process.env.MONG0_URL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => {
//   console.log("Connected to MongoDB");
// }).catch(err => {
//   console.error("MongoDB connection error:", err);
// });

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

// Routes
app.get("/", (req, res) => {
  res.send("server working");
});

app.post("/signup", (req, res) => {
  const { email } = req.body;
  RegistrationModel.findOne({ email })
    .then((user) => {
      if (user) {
        res.status(400).json({ message: "Email is already registered" });
      } else {
        RegistrationModel.create(req.body)
          .then((user) => res.json(user))
          .catch((err) => res.status(500).json(err.message));
      }
    })
    .catch((err) => res.status(500).json(err.message));
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  RegistrationModel.findOne({ email })
    .then(user => {
      if (user) {
        if (user.password === password) {
          // Return user details on successful login
          res.json({ status: "Success", user: { name: user.name, email: user.email } });
        } else {
          res.status(400).json("Password is incorrect");
        }
      } else {
        res.status(400).json("Email was not registered");
      }
    })
    .catch(err => res.status(500).json(err.message));
});

app.post("/feedback", async (req, res) => {
  const { name, email, productName, message } = req.body;
  try {
    const newFeedback = new FeedbackModel({ name, email, productName, message });
    const feedback = await newFeedback.save();
    res.json({ status: "Success", feedback });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

app.post("/newsLetter", (req, res) => {
  const { email } = req.body;
  NewsletterModel.findOne({ email })
    .then((user) => {
      if (user) {
        res.status(400).json({ message: "You're already on our list" });
      } else {
        NewsletterModel.create(req.body)
          .then((user) => res.json(user))
          .catch((err) => res.status(500).json(err.message));
      }
    })
    .catch((err) => res.status(500).json(err.message));
});


// Razorpay APIs
app.post("/create-order", async (req, res) => {
  const { amount, currency } = req.body;
  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Amount in paise
      currency: currency || "INR",
      receipt: `receipt_${Date.now()}`,
    });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/verify-payment", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const hmac = crypto.createHmac("sha256", process.env.KEY_SECRET);
  hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const generatedSignature = hmac.digest("hex");

  if (generatedSignature === razorpay_signature) {
    res.status(200).json({ success: true, message: "Payment verified successfully" });
  } else {
    res.status(400).json({ success: false, message: "Payment verification failed" });
  }
});

// Start the server
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});