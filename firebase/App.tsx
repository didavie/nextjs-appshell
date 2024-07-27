"use client";
import { FirebaseAppProvider } from "reactfire";
import React from "react";
import Provider from "./Provider";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export default function FirebaseApp({ children }: React.PropsWithChildren<{}>) {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <Provider>{children}</Provider>
    </FirebaseAppProvider>
  );
}
