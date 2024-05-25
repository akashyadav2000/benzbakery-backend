const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require('dotenv').config();
const cors = require("cors");
const RegistrationModel = require("./models/Registration");
const FeedbackModel = require("./models/Feedback");
const NewsletterModel = require("./models/Newsletter");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 10,
}).then(() => {
  console.log("Connected to MongoDB Atlas");
}).catch(err => {
  console.error("Failed to connect to MongoDB", err);
});

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await RegistrationModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new RegistrationModel({ name, email, password: hashedPassword });
    await newUser.save();

    res.json({ status: "Success", user: { name, email } });
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).json({ message: "An error occurred. Please try again." });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await RegistrationModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email is not registered" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (match) {
      res.json({ status: "Success", user: { name: user.name, email: user.email } });
    } else {
      res.status(400).json({ message: "Incorrect password" });
    }
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "An error occurred. Please try again." });
  }
});

app.post("/feedback", async (req, res) => {
  const { name, email, productName, message } = req.body;
  try {
    const newFeedback = new FeedbackModel({ name, email, productName, message });
    const feedback = await newFeedback.save();
    res.json({ status: "Success", feedback });
  } catch (err) {
    console.error("Error during feedback submission:", err);
    res.status(500).json({ message: "An error occurred. Please try again." });
  }
});

app.post("/newsLetter", async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await NewsletterModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "You're already on our list" });
    }

    const newSubscriber = new NewsletterModel({ email });
    await newSubscriber.save();
    res.json({ status: "Success", email });
  } catch (err) {
    console.error("Error during newsletter subscription:", err);
    res.status(500).json({ message: "An error occurred. Please try again." });
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
