import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { enableIndexedDbPersistence, getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAVzdnw1cNgCo5HHBHHPOClEz0nSR5k0wY",
  authDomain: "golf-67f27.firebaseapp.com",
  databaseURL:
    "https://golf-67f27-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "golf-67f27",
  storageBucket: "golf-67f27.appspot.com",
  messagingSenderId: "37704039951",
  appId: "1:37704039951:web:27f7862c71d9612fd4ed7a"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);

const db = getFirestore(app);
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled
    // in one tab at a a time.
    // ...
    console.error(err);
  } else if (err.code === 'unimplemented') {
    // The current browser does not support all of the
    // features required to enable persistence
    // ...
    console.error(err)
  }
});