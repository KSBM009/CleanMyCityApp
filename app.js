const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

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
  googleId: String,
  displayName: String,
  // Add other user properties as needed
});

const User = mongoose.model('User', userSchema);

// Configure session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

// Initialize Passport and use session middleware
app.use(passport.initialize());
app.use(passport.session());

// Configure Google OAuth 2.0 strategy
passport.use(new GoogleStrategy({
    clientID: 'your-google-client-id',
    clientSecret: 'your-google-client-secret',
    callbackURL: 'http://localhost:3000/auth/google/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    // Check if the user is already in the database
    const existingUser = await User.findOne({ googleId: profile.id });

    if (existingUser) {
      return done(null, existingUser);
    }

    // If the user is new, create a new user in the database
    const newUser = new User({
      googleId: profile.id,
      displayName: profile.displayName,
      // Add other user properties as needed
    });

    await newUser.save();
    done(null, newUser);
  }
));

// Serialize user information to store in the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// Routes
app.get('/', (req, res) => res.send('Home Page'));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => res.redirect('/')
);

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.get('/profile', isAuthenticated, (req, res) => {
  res.send(`Welcome ${req.user.displayName}!`);
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
<<<<<<< HEAD

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
=======
>>>>>>> origin/adminDashboard
