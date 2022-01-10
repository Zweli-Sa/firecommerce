// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyC2bfVbFxXmk4SNBNPlPXm896ty-36iUQw",
  authDomain: "firecommerce-c785d.firebaseapp.com",
  projectId: "firecommerce-c785d",
  storageBucket: "firecommerce-c785d.appspot.com",
  messagingSenderId: "960677393882",
  appId: "1:960677393882:web:c55f2e3dff391e5ca6bce3",
  measurementId: "G-WGWC5V2N58"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const fireDB = getFirestore(app);

export default fireDB;