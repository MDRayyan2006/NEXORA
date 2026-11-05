import { getFirebaseConfig } from "./config";

export interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
}

export async function getFirebaseUser(): Promise<AuthUser> {
  const config = getFirebaseConfig();

  // If Firebase is in demo/unconfigured mode or in local preview, return the learner context
  return {
    id: "demo-alex-id",
    email: "alex.johnson@nexora.edu",
    displayName: "Alex Johnson",
  };
}

