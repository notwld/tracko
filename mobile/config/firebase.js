import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import Constants from "expo-constants";
// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBIfxZmvl2VFal9Sojrdt27dISBvnp_1iE",
  authDomain: "tracko-3d24a.firebaseapp.com",
  projectId: "tracko-3d24a",
  storageBucket: "tracko-3d24a.appspot.com",
  messagingSenderId: "367905168890",
  appId: "1:367905168890:web:5ddfac31a3de906f6c5843",
  measurementId: "G-WBBQ6SYKY0"
  //   @deprecated is deprecated Constants.manifest
};
// initialize firebase
initializeApp(firebaseConfig);
export const auth = getAuth();
export const database = getFirestore();
