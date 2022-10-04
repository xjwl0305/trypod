// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebase from "firebase/compat";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBOxfvE6pQcPuTA8EQNhoygUgsmmC37bIQ",
    authDomain: "earlivery-system.firebaseapp.com",
    projectId: "earlivery-system",
    storageBucket: "earlivery-system.appspot.com",
    messagingSenderId: "499593446307",
    appId: "1:499593446307:web:dec4db8e77345b24041016",
    measurementId: "G-RTLYZMTXT7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = firebase.auth();
const analytics = getAnalytics(app);