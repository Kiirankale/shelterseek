// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNaPT_V8vydMJH40gZT_lrICbb8DedmxI",
  authDomain: "shelterseek-react.firebaseapp.com",
  projectId: "shelterseek-react",
  storageBucket: "shelterseek-react.appspot.com",
  messagingSenderId: "139740723899",
  appId: "1:139740723899:web:107bcf4d801b4d7f73879e"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db =getFirestore()