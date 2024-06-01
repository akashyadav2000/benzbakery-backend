const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config()
const cors = require("cors");
const RegistrationModel = require("./models/Registration");
const FeedbackModel = require("./models/Feedback");
const NewsletterModel = require("./models/Newsletter");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONG0_URL);

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


app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
