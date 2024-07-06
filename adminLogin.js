
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

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
const db = getDatabase(app);
const auth = getAuth(app);

const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('input-email');
const passwordInput = document.getElementById('input-password');
const errorMsg = document.getElementById('password-span');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log(user);
            alert('Login successful');
            window.location.href = 'admindash.html'; // Redirect to adminDashboard page on successful login
        })
        .catch((error) => {
            const errorMessage = error.message;
            console.error(errorMessage);
            alert(errorMessage);
            errorMsg.textContent = errorMessage;
        });
});

// Google Sign-In function
const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log(user);
        alert('Login successful');
        window.location.href = 'admindash.html'; // Redirect to events page on successful login
    } catch (error) {
        console.error(error.message);
        alert(error.message);
    }
};