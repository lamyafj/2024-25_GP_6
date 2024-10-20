//src/firebaseConfig.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getDatabase, ref, onValue } from 'firebase/database';
import { getFirestore } from "firebase/firestore"; // Add Firestore
import { getStorage } from "firebase/storage";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBEmmKehFtK7RPmf1xNPmb-iXlJaoXh1Lc",
  authDomain: "maslak-d4678.firebaseapp.com",
  databaseURL: "https://maslak-d4678-default-rtdb.firebaseio.com",
  projectId: "maslak-d4678",
  storageBucket: "maslak-d4678.appspot.com",
  messagingSenderId: "404422610322",
  appId: "1:404422610322:web:8856213c33a979384ac54b",
  measurementId: "G-BHKZS3Y0SE"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app); // Export Firestore (db)
export const storage = getStorage(app);
const database = getDatabase(app);
export { database, ref, onValue ,auth};
