const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();
const cors = require("cors");
const RegistrationModel = require("./models/Registration");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 10,  // Connection pool size
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

    const newUser = new RegistrationModel({ name, email, password });
    await newUser.save();

    res.json({ status: "Success", user: { name, email } });
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).json({ message: "An error occurred. Please try again." });
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
