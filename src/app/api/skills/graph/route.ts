import { NextRequest, NextResponse } from "next/server";
import {
  getAllQualifiedSkills,
  getComputedKnowledgeGraph,
  calculateUserGamification,
  getComputedInternshipMatches,
  getComputedLeaderboard,
} from "@/lib/services/skills-service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userName = searchParams.get("userName") || "You (Current Learner)";

    const skills = getAllQualifiedSkills();
    const graph = getComputedKnowledgeGraph(skills);
    const gamification = calculateUserGamification(skills);
    const internships = getComputedInternshipMatches(skills);
    const leaderboard = getComputedLeaderboard(skills, userName);

    return NextResponse.json({
      success: true,
      skills,
      graph,
      gamification,
      internships,
      leaderboard,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch skills graph" },
      { status: 500 }
    );
  }
}

