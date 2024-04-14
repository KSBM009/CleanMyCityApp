const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

// const app = express();
const PORT = 5500;

mongoose.connect(
    process.env.MONGOURL ||
      "mongodb+srv://kevinstephenbiju2025:YgPEgzKU86t@ksbmcluster01.rfmkko1.mongodb.net/?retryWrites=true&w=majority&appName=KsbmCluster01",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Connected to Database!");
  })
  .catch((er) => {
    console.log(er);
  });

// User Schema
const userSchema = new mongoose.Schema({
  emailId: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Signup Route
app.post("/signup", async (req, res) => {
  const { emailId, password } = req.body;

  try {
    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ emailId, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  try {
    const user = await User.findOne({ emailId });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Event Schema
const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  // category: String,
  location: String,
  dateTime: Date,
  volunteersRequired: Number,
});

const Event = mongoose.model("Event", eventSchema);

// Middleware to parse JSON data
app.use(bodyParser.json());

// Route to handle form submission
app.post("/submitEvent", async (req, res) => {
  const {
    title,
    description,
    // category, //If category is supposed to be in the form, make sure it's included in the form and extracted here
    location,
    dateTime,
    volunteersRequired,
  } = req.body;

  try {
    const newEvent = new Event({
      title,
      description,
      // category, //If category is supposed to be in the form, make sure it's included here
      location,
      dateTime,
      volunteersRequired,
    });

    await newEvent.save();

    res.status(201).json({ message: "Event registration successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyClhhuFS3moOoAsQZvMoasKi1icQ65M_rQ",
  authDomain: "cleanmycityapp.firebaseapp.com",
  projectId: "cleanmycityapp",
  storageBucket: "cleanmycityapp.appspot.com",
  messagingSenderId: "1002744065608",
  appId: "1:1002744065608:web:f1cad15f0c4236a635327d",
  measurementId: "G-W7FZYG79C8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);