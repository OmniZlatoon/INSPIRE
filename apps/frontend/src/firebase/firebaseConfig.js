import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAaLwaddvI9v93k4Bu9sH-hZiSAj2i-adY",
  authDomain: "inspire-421a6.firebaseapp.com",
  projectId: "inspire-421a6",
  storageBucket: "inspire-421a6.firebasestorage.app",
  messagingSenderId: "187931400350",
  appId: "1:187931400350:web:b428fc49793abd7041838f",
  measurementId: "G-YQKFF3TM2D"
};

const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

// Analytics is only available in browser
let analytics;
if (typeof window !== "undefined") {
    analytics = getAnalytics(app);
}

export { analytics };
export default app;
