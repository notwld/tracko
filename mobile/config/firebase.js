import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAYGWhlxKSngstW_mzEE6oscRmOBPn0ebE",
  authDomain: "tracko-f297a.firebaseapp.com",
  projectId: "tracko-f297a",
  storageBucket: "tracko-f297a.appspot.com",
  messagingSenderId: "644418391939",
  appId: "1:644418391939:web:b5b6d03a0d61c97d7a30b6",
  measurementId: "G-EGE4QQT5HG"
  //   @deprecated is deprecated Constants.manifest
};
// initialize firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getFirestore(app);
