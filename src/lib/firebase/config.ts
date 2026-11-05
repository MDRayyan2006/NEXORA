import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

export function getFirebaseConfig() {
  const apiKey =
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCs2KdFanxWP01BmQWzQbUtrbZpmGHjYSw";
  const authDomain =
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "gdgvizag-4c54e.firebaseapp.com";
  const projectId =
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "gdgvizag-4c54e";
  const storageBucket =
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "gdgvizag-4c54e.firebasestorage.app";
  const messagingSenderId =
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "88453910197";
  const appId =
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:88453910197:web:66e748e7618c5ef3e778fc";
  const measurementId =
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-GPQSQHBJYY";

  const isConfigured = Boolean(
    apiKey && !apiKey.includes("YOUR_")
  );

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId,
    isConfigured,
  };
}

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let analytics: Analytics | null = null;

export function initFirebase() {
  const config = getFirebaseConfig();
  if (!getApps().length) {
    app = initializeApp(config);
  } else {
    app = getApp();
  }

  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  // Initialize analytics only on client-side where supported
  if (typeof window !== "undefined") {
    isSupported().then((supported) => {
      if (supported && !analytics) {
        analytics = getAnalytics(app);
      }
    }).catch(() => {});
  }

  return { app, auth, db, storage, analytics, isConfigured: config.isConfigured };
}

export { auth, db, storage, analytics };
