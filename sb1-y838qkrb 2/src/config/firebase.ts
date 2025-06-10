import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  initializeFirestore,
  CACHE_SIZE_UNLIMITED,
  persistentLocalCache,
  persistentMultipleTabManager
} from 'firebase/firestore';
import { getAnalytics, isSupported } from "firebase/analytics";

// Firebase configuration object - this will be replaced with environment variables in production
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-key-for-development",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:000000000000:web:0000000000000000000000",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-0000000000"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Analytics only if supported by the browser
let analytics = null;
isSupported().then(yes => yes && (analytics = getAnalytics(app)))
  .catch(err => console.error('Analytics initialization failed:', err));

// Initialize Auth with error handling
export const auth = getAuth(app);

// Initialize Firestore with improved persistence settings
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
    cacheSizeBytes: CACHE_SIZE_UNLIMITED
  }),
  // Automatically detect best transport method
  experimentalAutoDetectLongPolling: true
});

// Export analytics
export { analytics };