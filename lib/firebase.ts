import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDurorHzxnOUjoIXUkechZmxf9NxhxDEUQ",
  authDomain: "policheq.firebaseapp.com",
  projectId: "policheq",
  storageBucket: "policheq.firebasestorage.app",
  messagingSenderId: "52156364972",
  appId: "1:52156364972:web:e6b9c6b6d526dbb4d0f483",
  measurementId: "G-77LWWX21L5"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { auth, db, googleProvider, analytics };
