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
  poolSize: 10 // Connection pooling for better performance
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Signup request received:', req.body);

    const user = await RegistrationModel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new RegistrationModel({ ...req.body, password: hashedPassword });
    const savedUser = await newUser.save();

    res.json(savedUser);
  } catch (err) {
    console.error('Error in /signup route:', err); // Log the error
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await RegistrationModel.findOne({ email });
    if (!user) {
      return res.status(400).json("Email was not registered");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json("The password is incorrect");
    }

    res.json({ status: "Success", user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error('Error in /login route:', err); // Log the error
    res.status(500).json(err.message);
  }
});

app.post("/feedback", async (req, res) => {
  const { name, email, productName, message } = req.body;

  try {
    const newFeedback = new FeedbackModel({ name, email, productName, message });
    const feedback = await newFeedback.save();
    res.json({ status: "Success", feedback });
  } catch (err) {
    console.error('Error in /feedback route:', err); // Log the error
    res.status(500).json(err.message);
  }
});

app.post("/newsLetter", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await NewsletterModel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "You're already on our list" });
    }

    const newUser = new NewsletterModel(req.body);
    const savedUser = await newUser.save();

    res.json(savedUser);
  } catch (err) {
    console.error('Error in /newsLetter route:', err); // Log the error
    res.status(500).json(err.message);
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
