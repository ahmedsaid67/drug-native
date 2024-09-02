// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDACU-0rW50489oph1FGBZgWD3wQx2AcPE",
  authDomain: "drug-7f969.firebaseapp.com",
  projectId: "drug-7f969",
  storageBucket: "drug-7f969.appspot.com",
  messagingSenderId: "323503007313",
  appId: "1:323503007313:web:72f63a1ecc53a6295a3a70",
  measurementId: "G-Z0Y2N4NXDM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);