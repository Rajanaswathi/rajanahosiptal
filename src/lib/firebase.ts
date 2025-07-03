
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBNUdJUYwHWvr27fRIQaz1nFOJ6dhB7Mts",
  authDomain: "rajana-hospital.firebaseapp.com",
  projectId: "rajana-hospital",
  storageBucket: "rajana-hospital.firebasestorage.app",
  messagingSenderId: "184863951639",
  appId: "1:184863951639:web:53fa8847b87ac603e48552",
  measurementId: "G-LCBCX1Z9BH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
