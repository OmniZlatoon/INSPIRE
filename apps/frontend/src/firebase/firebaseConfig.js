import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAIvzANAgG8ptiUzDmDciibFCV9wPxxQv8",
  authDomain: "inspire-978b2.firebaseapp.com",
  projectId: "inspire-978b2",
  storageBucket: "inspire-978b2.firebasestorage.app",
  messagingSenderId: "153222818138",
  appId: "1:153222818138:web:c1a4b871e07da97054eb63",
  measurementId: "G-1H59BHRD70"
};

const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');


// Analytics is only available in browser
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { analytics };
export default app;
