import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Replace with your actual Firebase project configuration from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyAuIpwq4j6bTpjxrxQQTf-6ZyLjbrYr5qs",
  authDomain: "meal-planner-67f3e.firebaseapp.com",
  projectId: "meal-planner-67f3e",
  storageBucket: "meal-planner-67f3e.firebasestorage.app",
  messagingSenderId: "989590112626",
  appId: "1:989590112626:web:eae50925dcb23dc387f5eb",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
