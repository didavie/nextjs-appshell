// Import the functions you need from the SDKs you need
import { FirebaseApp, getApps, initializeApp } from "firebase/app";

import * as ad from "firebase-admin";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
// import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
// import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
// import { getStorage, connectStorageEmulator } from "firebase/storage";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase

let app: FirebaseApp;
let admin: ad.app.App;

try {
  if (getApps().length === 0) {
    getApps().length === 0;
    app = initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    });
    console.log("Firebase Initialized");
    admin = ad.initializeApp();
  } else {
    app = getApps()[0];
    console.log("Firebase already initialized");
    admin = ad.app();
  }
} catch (e) {
  app = getApps()[0];
  admin = ad.app();
}

const auth = getAuth(app);
const db = ad.firestore();

export { auth, db, admin };
