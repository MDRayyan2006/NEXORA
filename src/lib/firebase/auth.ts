import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  type User,
} from "firebase/auth";
import { initFirebase } from "./config";
import { saveLearnerProfile } from "./db";

export async function signUpWithEmail(email: string, pass: string, displayName: string) {
  const { auth, isConfigured } = initFirebase();

  if (!isConfigured) {
    return {
      user: {
        uid: "demo-alex-id",
        email,
        displayName,
      },
      error: null,
    };
  }

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (displayName) {
      await updateProfile(cred.user, { displayName }).catch(() => {});
    }

    // Try saving learner profile with timeout protection
    try {
      await saveLearnerProfile(cred.user.uid, {
        display_name: displayName,
        preferred_language: "en",
        education_level: "Undergraduate",
        bio: "Learning Intelligence & Human Capability Discovery learner.",
        career_interests: ["Machine Learning", "Data Science", "Computer Science"],
        is_public: false,
      });
    } catch {
      // Non-fatal if Firestore rules/database are pending
    }

    return { user: cred.user, error: null };
  } catch (err: any) {
    // If Firebase Auth is not yet enabled in the console, provide graceful fallback so user is never blocked
    if (
      err.code === "auth/configuration-not-found" ||
      err.code === "auth/admin-restricted-operation" ||
      err.message?.includes("configuration-not-found")
    ) {
      console.warn(
        "Firebase Auth is not yet enabled in Firebase Console (project gdgvizag-4c54e). Creating session fallback."
      );
      return {
        user: {
          uid: "user-" + Date.now(),
          email,
          displayName: displayName || "Learner",
        },
        error: null,
        needsConsoleActivation: true,
      };
    }

    return { user: null, error: err.message || "Failed to sign up with Firebase." };
  }
}

export async function signInWithEmail(email: string, pass: string) {
  const { auth, isConfigured } = initFirebase();

  if (!isConfigured) {
    return {
      user: {
        uid: "demo-alex-id",
        email,
        displayName: "Alex Johnson",
      },
      error: null,
    };
  }

  try {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    return { user: cred.user, error: null };
  } catch (err: any) {
    if (
      err.code === "auth/configuration-not-found" ||
      err.code === "auth/admin-restricted-operation" ||
      err.message?.includes("configuration-not-found")
    ) {
      console.warn(
        "Firebase Auth is not yet enabled in Firebase Console. Logging in with demo session."
      );
      return {
        user: {
          uid: "demo-alex-id",
          email,
          displayName: "Alex Johnson",
        },
        error: null,
        needsConsoleActivation: true,
      };
    }

    return { user: null, error: err.message || "Invalid credentials." };
  }
}

export async function signOutUser() {
  const { auth, isConfigured } = initFirebase();
  if (isConfigured) {
    await firebaseSignOut(auth).catch(() => {});
  }
}

export function subscribeToAuthState(callback: (user: User | null) => void) {
  const { auth, isConfigured } = initFirebase();
  if (!isConfigured) {
    callback({
      uid: "demo-alex-id",
      email: "alex.johnson@nexora.edu",
      displayName: "Alex Johnson",
    } as User);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}
