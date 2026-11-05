import { initFirebase } from "./config";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export interface LearnerProfile {
  uid: string;
  display_name?: string;
  preferred_language?: string;
  education_level?: string;
  bio?: string;
  career_interests?: string[];
  avatar_url?: string;
  is_public?: boolean;
  updated_at?: any;
}

const DEFAULT_PROFILE: LearnerProfile = {
  uid: "demo-alex-id",
  display_name: "Alex Johnson",
  preferred_language: "en",
  education_level: "Undergraduate",
  bio: "Learning Intelligence & Human Capability Discovery learner.",
  career_interests: ["Machine Learning", "Mathematics", "Optimization"],
  is_public: false,
};

/**
 * Wraps any promise with a timeout. Returns null on timeout or error.
 * This prevents Firestore from hanging for 8+ seconds on a disabled project.
 */
async function withTimeout<T>(promise: Promise<T>, ms = 2500): Promise<T | null> {
  let timeoutId: ReturnType<typeof setTimeout>;
  const timeoutPromise = new Promise<null>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("Firestore timeout")), ms);
  });
  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId!);
    return result as T;
  } catch {
    clearTimeout(timeoutId!);
    return null;
  }
}

export async function getLearnerProfile(uid: string): Promise<LearnerProfile | null> {
  const { db, isConfigured } = initFirebase();
  if (!isConfigured) {
    return { ...DEFAULT_PROFILE, uid };
  }

  try {
    const docRef = doc(db, "learner_profiles", uid);
    const snap = await withTimeout(getDoc(docRef), 2500);
    if (snap && snap.exists()) {
      return snap.data() as LearnerProfile;
    }
    return { ...DEFAULT_PROFILE, uid };
  } catch {
    return { ...DEFAULT_PROFILE, uid };
  }
}

export async function saveLearnerProfile(uid: string, updates: Partial<LearnerProfile>) {
  const { db, isConfigured } = initFirebase();
  if (!isConfigured) {
    return { ...DEFAULT_PROFILE, ...updates, uid };
  }

  try {
    const docRef = doc(db, "learner_profiles", uid);
    await withTimeout(
      setDoc(
        docRef,
        {
          ...updates,
          uid,
          updated_at: serverTimestamp(),
        },
        { merge: true }
      ),
      2500
    );
    return { ...DEFAULT_PROFILE, ...updates, uid };
  } catch {
    return { ...DEFAULT_PROFILE, ...updates, uid };
  }
}

export async function saveMasteryEstimate(
  userId: string,
  conceptId: string,
  masteryProbability: number,
  correct: boolean
) {
  const { db, isConfigured } = initFirebase();
  if (!isConfigured) return;

  try {
    const docId = `${userId}_${conceptId}`;
    const docRef = doc(db, "mastery_estimates", docId);
    const snap = await withTimeout(getDoc(docRef), 2000);

    const prevAttempts = snap && snap.exists() ? snap.data().attempts || 0 : 0;
    const prevCorrect = snap && snap.exists() ? snap.data().correct_count || 0 : 0;

    await withTimeout(
      setDoc(
        docRef,
        {
          userId,
          conceptId,
          masteryProbability,
          attempts: prevAttempts + 1,
          correct_count: prevCorrect + (correct ? 1 : 0),
          lastAssessed: serverTimestamp(),
        },
        { merge: true }
      ),
      2000
    );
  } catch {}
}

export async function saveMissionAttempt(
  userId: string,
  missionId: string,
  evidenceText: string,
  xpEarned: number
) {
  const { db, isConfigured } = initFirebase();
  if (!isConfigured) return;

  try {
    const colRef = collection(db, "mission_attempts");
    await withTimeout(
      addDoc(colRef, {
        userId,
        missionId,
        evidenceText,
        xpEarned,
        status: "completed",
        submittedAt: serverTimestamp(),
      }),
      2000
    );
  } catch {}
}
