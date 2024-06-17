"use client";
import { connectAuthEmulator, getAuth } from "firebase/auth"; // Firebase v9+
import { getDatabase, connectDatabaseEmulator } from "firebase/database"; // Firebase v9+
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"; // Firebase v9+
import { getStorage, connectStorageEmulator } from "firebase/storage"; // Firebase v9+
import dynamic from "next/dynamic";
import {
  DatabaseProvider,
  AuthProvider,
  useFirebaseApp,
  FirestoreProvider,
} from "reactfire";
import React from "react";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";

function isBrowser() {
  return typeof window !== "undefined";
}

const AppCheckProvider: any = dynamic(() => import("./AppCheck"), {
  ssr: false,
});
function Provider({ children }: React.PropsWithChildren<{}>) {
  const app = useFirebaseApp();
  const database = getDatabase(app);
  const db = getFirestore(app);

  const storage = getStorage(app);
  const functions = getFunctions(app);
  // const persistence = isBrowser()
  //   ? indexedDBLocalPersistence
  //   : inMemoryPersistence;

  const auth = getAuth(app);

  if (process.env.NODE_ENV !== "production") {
    connectDatabaseEmulator(database, "localhost", 9000);
    connectAuthEmulator(auth, "http://localhost:9099");
    connectFirestoreEmulator(db, "localhost", 8080);
    connectStorageEmulator(storage, "localhost", 9199);
    connectFunctionsEmulator(functions, "localhost", 5001);
  }

  return (
    <AppCheckProvider>
      <DatabaseProvider sdk={database}>
        <FirestoreProvider sdk={db}>
          <AuthProvider sdk={auth}>{children}</AuthProvider>
        </FirestoreProvider>
      </DatabaseProvider>
    </AppCheckProvider>
  );
}

export default Provider;
