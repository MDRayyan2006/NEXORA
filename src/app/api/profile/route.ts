import { NextRequest, NextResponse } from "next/server";
import { getFirebaseUser } from "@/lib/firebase/auth-helper";
import { getLearnerProfile, saveLearnerProfile } from "@/lib/firebase/db";

export async function GET() {
  const user = await getFirebaseUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await getLearnerProfile(user.id);

  return NextResponse.json({
    profile: profile || {
      display_name: user.displayName || "Alex Johnson",
      preferred_language: "en",
      education_level: "Undergraduate",
      bio: "Learning Intelligence & Human Capability Discovery learner.",
    },
    email: user.email,
  });
}

export async function PATCH(req: NextRequest) {
  const user = await getFirebaseUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const allowed = ["display_name", "preferred_language", "education_level", "bio", "career_interests", "avatar_url", "is_public"];
  const updates: Record<string, unknown> = {};
  for (const key of allowed) if (key in body) updates[key] = body[key];

  const updatedProfile = await saveLearnerProfile(user.id, updates);

  return NextResponse.json({ profile: updatedProfile });
}
