/**
 * (auth) Route Group Layout
 *
 * Validates the authenticated session via Firebase.
 * In demo mode or when Firebase keys are unconfigured, supplies a mock learner
 * profile so the full platform is testable out of the box.
 */

import { AppShell } from "@/components/layout/AppShell";
import { getFirebaseUser } from "@/lib/firebase/auth-helper";
import { getLearnerProfile } from "@/lib/firebase/db";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getFirebaseUser();

  // Retrieve learner profile from Firestore (or fallback defaults)
  const profile = await getLearnerProfile(user.id);

  const userInfo = {
    email: user.email,
    display_name: profile?.display_name || user.displayName || "Alex Johnson",
    avatar_url: profile?.avatar_url || null,
  };

  return <AppShell user={userInfo}>{children}</AppShell>;
}
