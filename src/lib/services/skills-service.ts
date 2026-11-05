export interface QualifiedSkill {
  id: string;
  topic: string;
  score: number;
  total: number;
  passed: boolean;
  dateLearned: string;
  timestamp: number;
  method: "phone_call" | "web_simulator";
  studentName: string;
  phoneNumber?: string;
  verifiedBadge: string;
}

// In-memory store of qualified skills (persists across API requests in server lifecycle)
const qualifiedSkillsStore: QualifiedSkill[] = [
  {
    id: "skill-init-1",
    topic: "Commercial Percentages & Discounts",
    score: 2,
    total: 2,
    passed: true,
    dateLearned: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    timestamp: Date.now() - 86400000,
    method: "phone_call",
    studentName: "Student",
    verifiedBadge: "Oral Keypad Test: 100% Score Verified",
  },
];

export function recordSkillQualification(params: {
  topic: string;
  score: number;
  total: number;
  passed: boolean;
  studentName?: string;
  phoneNumber?: string;
  method?: "phone_call" | "web_simulator";
}): QualifiedSkill {
  const {
    topic,
    score,
    total,
    passed,
    studentName = "Student",
    phoneNumber,
    method = "phone_call",
  } = params;

  // Check if already qualified recently to update or insert
  const existingIdx = qualifiedSkillsStore.findIndex(
    (s) => s.topic.toLowerCase() === topic.toLowerCase()
  );

  const skill: QualifiedSkill = {
    id: `skill-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    topic,
    score,
    total,
    passed,
    dateLearned: new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    timestamp: Date.now(),
    method,
    studentName,
    phoneNumber,
    verifiedBadge: `Verified via ${method === "phone_call" ? "Live Phone Call" : "Simulator"} (${score}/${total} MCQs Passed)`,
  };

  if (existingIdx >= 0) {
    // Update with latest score
    qualifiedSkillsStore[existingIdx] = skill;
  } else {
    qualifiedSkillsStore.unshift(skill);
  }

  return skill;
}

export function getAllQualifiedSkills(): QualifiedSkill[] {
  return [...qualifiedSkillsStore];
}

