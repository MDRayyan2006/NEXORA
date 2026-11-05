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
  xpEarned: number;
}

export interface KnowledgeNode {
  id: string;
  label: string;
  category: "Mathematics" | "Physics & Circuits" | "Commercial & Trade" | "Communication" | "Computer Science";
  level: "Foundational" | "Applied" | "Advanced";
  tier: 1 | 2 | 3;
  xpReward: number;
  prerequisites: string[];
  callTopic: string;
  description: string;
  jobRelevance: string[];
  // Computed dynamically based on user's real skills
  status: "mastered" | "in_progress" | "locked";
  score?: number;
  total?: number;
  verificationBadge?: string;
}

export interface MarketInternship {
  id: string;
  title: string;
  company: string;
  sector: string;
  stipend: string;
  location: string;
  duration: string;
  type: "Apprenticeship" | "Internship" | "Government NATS/PMKVY";
  minXp: number;
  requiredSkills: string[];
  description: string;
  // Computed dynamically
  matchScore: number; // 0 to 100
  matchedSkills: string[];
  missingSkills: string[];
  readyToApply: boolean;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  location: string;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond";
  xp: number;
  skillsMastered: number;
  callStreak: number;
  oralAccuracy: string;
  isCurrentUser: boolean;
  badge: string;
}

// In-memory store of qualified skills (persists in server runtime)
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
    xpEarned: 150,
  },
];

// Master Knowledge Graph Definition
export const KNOWLEDGE_GRAPH_NODES: Omit<KnowledgeNode, "status" | "score" | "total" | "verificationBadge">[] = [
  {
    id: "math-percentages",
    label: "Percentages & Retail Discounts",
    category: "Mathematics",
    level: "Foundational",
    tier: 1,
    xpReward: 150,
    prerequisites: [],
    callTopic: "Percentages & Ratios",
    description: "Calculating percentage markups, inventory discounts, and proportional ratios.",
    jobRelevance: ["Retail Store Cashier", "Inventory Billing", "Counter Clerk"],
  },
  {
    id: "math-linear",
    label: "Linear Equations & Symbolic Logic",
    category: "Mathematics",
    level: "Foundational",
    tier: 1,
    xpReward: 150,
    prerequisites: [],
    callTopic: "Linear Equations & Algebra",
    description: "Solving single and two-variable equations and numerical balances.",
    jobRelevance: ["Data Entry Operator", "Billing Verification", "Logistics Associate"],
  },
  {
    id: "physics-circuits",
    label: "Ohm's Law & Circuit Diagnostics",
    category: "Physics & Circuits",
    level: "Foundational",
    tier: 1,
    xpReward: 150,
    prerequisites: [],
    callTopic: "Ohm's Law & Circuit Diagnostics",
    description: "Voltage, current, resistance relationships and basic component load safety.",
    jobRelevance: ["Electrician Apprentice", "Solar Panel Technician", "Appliance Repair"],
  },
  {
    id: "physics-motion",
    label: "Newton's Laws & Mechanical Force",
    category: "Physics & Circuits",
    level: "Foundational",
    tier: 1,
    xpReward: 150,
    prerequisites: [],
    callTopic: "Newton's Third Law of Motion",
    description: "Action-reaction pairs, momentum balance, and practical vehicle motion.",
    jobRelevance: ["Automobile Apprentice", "Machinery Operator", "Workshop Technician"],
  },
  {
    id: "comm-english",
    label: "Workplace Spoken English & Phone Etiquette",
    category: "Communication",
    level: "Foundational",
    tier: 1,
    xpReward: 150,
    prerequisites: [],
    callTopic: "Workplace Spoken English & Customer Calls",
    description: "Professional telephone conversation, polite query handling, and clear articulation.",
    jobRelevance: ["Customer Support Executive", "Front Desk Representative", "Telesales"],
  },
  {
    id: "commercial-billing",
    label: "Supermarket POS Billing & Ledger Balances",
    category: "Commercial & Trade",
    level: "Applied",
    tier: 2,
    xpReward: 250,
    prerequisites: ["math-percentages", "math-linear"],
    callTopic: "Retail POS Billing & Cash Register Balances",
    description: "Daily register closing, sales tax calculations, and cash reconciliations.",
    jobRelevance: ["Store Cashier Executive", "Inventory Accounts Clerk"],
  },
  {
    id: "solar-maintenance",
    label: "Solar Photovoltaic Inverter & Load Balancing",
    category: "Physics & Circuits",
    level: "Applied",
    tier: 2,
    xpReward: 250,
    prerequisites: ["physics-circuits"],
    callTopic: "Solar Inverter Wiring & Battery Load Balancing",
    description: "Testing battery bank voltages, wiring inverter lines, and electrical ground safety.",
    jobRelevance: ["Solar Site Installation Apprentice", "Field Energy Technician"],
  },
  {
    id: "customer-operations",
    label: "CRM Customer Doubt Resolution & Escalations",
    category: "Communication",
    level: "Applied",
    tier: 2,
    xpReward: 250,
    prerequisites: ["comm-english"],
    callTopic: "Customer Objection Handling & Support Protocols",
    description: "Managing upset customers, step-by-step problem resolution, and logging tickets.",
    jobRelevance: ["BPO Senior Support", "Service Desk Coordinator"],
  },
  {
    id: "tech-trade-master",
    label: "Certified Industrial Electrical & Operations Lead",
    category: "Commercial & Trade",
    level: "Advanced",
    tier: 3,
    xpReward: 400,
    prerequisites: ["solar-maintenance", "commercial-billing"],
    callTopic: "Industrial Facility Safety & Power Distribution",
    description: "Supervising small electrical teams, managing commercial budgets, and quality compliance.",
    jobRelevance: ["Junior Plant Supervisor", "Senior Apprentice Lead"],
  },
];

// Market Internship Catalog
export const MARKET_INTERNSHIPS: Omit<MarketInternship, "matchScore" | "matchedSkills" | "missingSkills" | "readyToApply">[] = [
  {
    id: "intern-1",
    title: "Store Billing & Commercial Cashier Intern",
    company: "SmartBazaar Retail Chains",
    sector: "Retail & Commercial Services",
    stipend: "₹12,000 / month",
    location: "Visakhapatnam, Andhra Pradesh",
    duration: "6 Months",
    type: "Internship",
    minXp: 200,
    requiredSkills: [
      "Percentages & Retail Discounts",
      "Linear Equations & Symbolic Logic",
      "Supermarket POS Billing & Ledger Balances",
    ],
    description: "Handle point-of-sale customer billing, discount scanning, daily cash register closing, and stock invoice tallying.",
  },
  {
    id: "intern-2",
    title: "Solar & Low-Voltage Electrical Trade Apprentice",
    company: "GreenVolt Solar Energy Ltd.",
    sector: "Clean Energy & Electrical Systems",
    stipend: "₹14,500 / month",
    location: "Gajuwaka Industrial Corridor, Vizag",
    duration: "1 Year (PMKVY Recognized)",
    type: "Government NATS/PMKVY",
    minXp: 300,
    requiredSkills: [
      "Ohm's Law & Circuit Diagnostics",
      "Newton's Laws & Mechanical Force",
      "Solar Photovoltaic Inverter & Load Balancing",
    ],
    description: "Work under certified master electricians installing rooftop solar panels, wiring inverters, testing multimeters, and ensuring safety standards.",
  },
  {
    id: "intern-3",
    title: "Customer Support & Telephony Service Executive",
    company: "Apex Telecom Solutions",
    sector: "Customer Operations & ITES",
    stipend: "₹15,000 / month",
    location: "Remote / Hybrid (Andhra Pradesh)",
    duration: "3 Months",
    type: "Internship",
    minXp: 250,
    requiredSkills: [
      "Workplace Spoken English & Phone Etiquette",
      "CRM Customer Doubt Resolution & Escalations",
    ],
    description: "Assist inbound callers with service plans, billing clarifications, technical troubleshooting, and logging support tickets in native Telugu and English.",
  },
  {
    id: "intern-4",
    title: "Supply Chain & Numerical Logistics Assistant",
    company: "FastRoute Logistics Hub",
    sector: "Warehousing & Supply Chain",
    stipend: "₹13,500 / month",
    location: "Duvvada Logistics Zone",
    duration: "6 Months",
    type: "Apprenticeship",
    minXp: 300,
    requiredSkills: [
      "Percentages & Retail Discounts",
      "Linear Equations & Symbolic Logic",
      "Newton's Laws & Mechanical Force",
    ],
    description: "Calculate delivery weight capacities, verify parcel barcode registries, and assist warehouse managers in inventory dispatch.",
  },
  {
    id: "intern-5",
    title: "Junior Facility & Industrial Operations Lead Apprentice",
    company: "Visakha Heavy Engineering Corp.",
    sector: "Industrial Manufacturing",
    stipend: "₹18,000 / month + Certificate",
    location: "Auto Nagar, Visakhapatnam",
    duration: "1 Year",
    type: "Government NATS/PMKVY",
    minXp: 500,
    requiredSkills: [
      "Ohm's Law & Circuit Diagnostics",
      "Solar Photovoltaic Inverter & Load Balancing",
      "Certified Industrial Electrical & Operations Lead",
    ],
    description: "Prestigious NATS-certified apprenticeship training candidates for full-time junior plant engineer positions upon completion.",
  },
];

// Helper: Calculate User Gamified XP & Tier
export function calculateUserGamification(skills: QualifiedSkill[]) {
  const totalXp = skills.reduce((sum, s) => sum + (s.xpEarned || 150), 0);
  const totalSkills = skills.length;
  const streak = Math.max(skills.length > 0 ? 3 : 0, 1);

  let tier: "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond" = "Bronze";
  let nextTierXp = 300;
  let tierTitle = "Novice Apprentice";
  let tierBadge = "🥉 Bronze";

  if (totalXp >= 1800) {
    tier = "Diamond";
    nextTierXp = 2500;
    tierTitle = "Nexora Grandmaster";
    tierBadge = "💎 Diamond";
  } else if (totalXp >= 1000) {
    tier = "Platinum";
    nextTierXp = 1800;
    tierTitle = "Elite Industry Specialist";
    tierBadge = "🏆 Platinum";
  } else if (totalXp >= 600) {
    tier = "Gold";
    nextTierXp = 1000;
    tierTitle = "Verified Specialist";
    tierBadge = "🥇 Gold";
  } else if (totalXp >= 300) {
    tier = "Silver";
    nextTierXp = 600;
    tierTitle = "Skilled Practitioner";
    tierBadge = "🥈 Silver";
  }

  const progressToNext = Math.min(100, Math.round((totalXp / nextTierXp) * 100));

  return {
    totalXp,
    totalSkills,
    streak,
    tier,
    tierTitle,
    tierBadge,
    nextTierXp,
    progressToNext,
  };
}

// Helper: Build Real-time Knowledge Graph
export function getComputedKnowledgeGraph(skills: QualifiedSkill[]): KnowledgeNode[] {
  // Normalize topic names in skills
  const masteredTopics = new Set<string>();
  const skillMap = new Map<string, QualifiedSkill>();

  for (const s of skills) {
    if (s.passed) {
      const lower = s.topic.toLowerCase();
      masteredTopics.add(lower);
      skillMap.set(lower, s);
    }
  }

  return KNOWLEDGE_GRAPH_NODES.map((node) => {
    // Check if mastered
    let isMastered = false;
    let foundSkill: QualifiedSkill | undefined = undefined;

    for (const [key, sk] of skillMap.entries()) {
      if (
        key.includes(node.label.toLowerCase()) ||
        node.label.toLowerCase().includes(key) ||
        node.callTopic.toLowerCase().includes(key) ||
        key.includes(node.id.replace("math-", "").replace("physics-", ""))
      ) {
        isMastered = true;
        foundSkill = sk;
        break;
      }
    }

    if (isMastered) {
      return {
        ...node,
        status: "mastered" as const,
        score: foundSkill?.score || 2,
        total: foundSkill?.total || 2,
        verificationBadge: foundSkill?.verifiedBadge || "Verified via Phone Call Test",
      };
    }

    // Check if all prerequisites are mastered
    const prereqsMet = node.prerequisites.every((prereqId) => {
      const prereqNode = KNOWLEDGE_GRAPH_NODES.find((n) => n.id === prereqId);
      if (!prereqNode) return true;
      for (const key of masteredTopics) {
        if (
          key.includes(prereqNode.label.toLowerCase()) ||
          prereqNode.label.toLowerCase().includes(key) ||
          prereqNode.callTopic.toLowerCase().includes(key)
        ) {
          return true;
        }
      }
      return false;
    });

    return {
      ...node,
      status: prereqsMet ? ("in_progress" as const) : ("locked" as const),
    };
  });
}

// Helper: Match Real Market Internships against User's Real Skills
export function getComputedInternshipMatches(skills: QualifiedSkill[]): MarketInternship[] {
  const userMasteredLabels: string[] = [];
  for (const s of skills) {
    if (s.passed) {
      userMasteredLabels.push(s.topic.toLowerCase());
    }
  }

  // Also include nodes recognized as mastered
  const graph = getComputedKnowledgeGraph(skills);
  for (const node of graph) {
    if (node.status === "mastered") {
      userMasteredLabels.push(node.label.toLowerCase());
    }
  }

  return MARKET_INTERNSHIPS.map((intern) => {
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    for (const reqSkill of intern.requiredSkills) {
      const isMatch = userMasteredLabels.some(
        (userSkill) =>
          userSkill.includes(reqSkill.toLowerCase()) ||
          reqSkill.toLowerCase().includes(userSkill) ||
          userSkill.includes(reqSkill.split(" ")[0].toLowerCase())
      );

      if (isMatch) {
        matchedSkills.push(reqSkill);
      } else {
        missingSkills.push(reqSkill);
      }
    }

    const matchScore = Math.round((matchedSkills.length / intern.requiredSkills.length) * 100);
    const readyToApply = missingSkills.length === 0;

    return {
      ...intern,
      matchScore,
      matchedSkills,
      missingSkills,
      readyToApply,
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}

// Helper: Competition Leaderboard with Live Current User Rank
export function getComputedLeaderboard(skills: QualifiedSkill[], currentUserName: string = "You"): LeaderboardUser[] {
  const { totalXp, totalSkills, streak, tier } = calculateUserGamification(skills);

  // Peer learners representing state-wide apprentices
  const peers: Omit<LeaderboardUser, "rank" | "isCurrentUser">[] = [
    {
      name: "Ananya Sharma",
      location: "Gajuwaka, Vizag",
      tier: "Diamond",
      xp: 2150,
      skillsMastered: 8,
      callStreak: 14,
      oralAccuracy: "96%",
      badge: "⚡ Top Apprentice",
    },
    {
      name: "Rajesh Varma",
      location: "Madhurawada, Vizag",
      tier: "Platinum",
      xp: 1450,
      skillsMastered: 6,
      callStreak: 9,
      oralAccuracy: "92%",
      badge: "🏅 Solar Apprentice",
    },
    {
      name: "Priya Krishna",
      location: "MVP Colony, Vizag",
      tier: "Gold",
      xp: 850,
      skillsMastered: 4,
      callStreak: 6,
      oralAccuracy: "88%",
      badge: "⭐ Retail Specialist",
    },
    {
      name: "Vikram Mohan",
      location: "Pendurthi, Vizag",
      tier: "Silver",
      xp: 450,
      skillsMastered: 3,
      callStreak: 4,
      oralAccuracy: "84%",
      badge: "🔥 Rising Talent",
    },
    {
      name: "Suresh Babu",
      location: "Anakapalle",
      tier: "Bronze",
      xp: 150,
      skillsMastered: 1,
      callStreak: 2,
      oralAccuracy: "80%",
      badge: "🌱 Fresh Learner",
    },
  ];

  // Insert current user
  const userEntry: Omit<LeaderboardUser, "rank" | "isCurrentUser"> = {
    name: currentUserName || "You (Current Learner)",
    location: "Visakhapatnam, AP",
    tier,
    xp: totalXp,
    skillsMastered: totalSkills,
    callStreak: streak,
    oralAccuracy: skills.length > 0 ? "100%" : "85%",
    badge: "🎯 Active Challenger",
  };

  const allEntries = [...peers, userEntry].sort((a, b) => b.xp - a.xp);

  return allEntries.map((entry, idx) => ({
    ...entry,
    rank: idx + 1,
    isCurrentUser: entry.name === userEntry.name,
  }));
}

// Record new skill qualification
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

  // Check if already qualified to update or insert
  const existingIdx = qualifiedSkillsStore.findIndex(
    (s) => s.topic.toLowerCase() === topic.toLowerCase()
  );

  const xpEarned = passed ? (score >= total ? 150 : 100) : 50;

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
    xpEarned,
  };

  if (existingIdx >= 0) {
    qualifiedSkillsStore[existingIdx] = skill;
  } else {
    qualifiedSkillsStore.unshift(skill);
  }

  return skill;
}

export function getAllQualifiedSkills(): QualifiedSkill[] {
  return [...qualifiedSkillsStore];
}
