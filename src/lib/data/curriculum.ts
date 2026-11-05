/**
 * NEXORA — Real Curriculum Catalog
 * 
 * Clean, practical topic taxonomy without mock data.
 * Used for AI Phone Tutoring, WhatsApp doubts, and Web Learning.
 */

export interface SubjectTopic {
  id: string;
  subject: string;
  title: string;
  description: string;
  gradeLevel: string;
  keypadPromptSample: string;
}

export const REAL_CURRICULUM: SubjectTopic[] = [
  {
    id: "math-percentages",
    subject: "Mathematics",
    title: "Percentages & Ratios",
    description: "Calculating discounts, percentage change, and direct/inverse ratios.",
    gradeLevel: "Grade 6-8",
    keypadPromptSample: "What is 20% of 150? Press 1 for 25, 2 for 30, 3 for 35, 4 for 40.",
  },
  {
    id: "math-linear-eq",
    subject: "Mathematics",
    title: "Linear Equations & Algebra",
    description: "Solving single and two-variable linear equations and word problems.",
    gradeLevel: "Grade 8-10",
    keypadPromptSample: "If 3x + 5 = 20, what is x? Press 1 for 3, 2 for 5, 3 for 15, 4 for 25.",
  },
  {
    id: "math-geometry",
    subject: "Mathematics",
    title: "Triangles & Pythagorean Theorem",
    description: "Area, perimeter, right-angled triangles, and Pythagorean triples.",
    gradeLevel: "Grade 8-10",
    keypadPromptSample: "In a right triangle with legs 3 and 4, what is the hypotenuse? Press 1 for 5, 2 for 6, 3 for 7.",
  },
  {
    id: "science-motion",
    subject: "Physics",
    title: "Speed, Velocity & Newton's Laws",
    description: "Understanding acceleration, inertia, force, and everyday motion examples.",
    gradeLevel: "Grade 9-11",
    keypadPromptSample: "Which law explains why you lurch forward when a bus brakes? Press 1 for First Law, 2 for Second, 3 for Third.",
  },
  {
    id: "science-electricity",
    subject: "Physics",
    title: "Electric Current & Ohm's Law",
    description: "Voltage, resistance, electric circuits, and household power safety.",
    gradeLevel: "Grade 9-12",
    keypadPromptSample: "If voltage is 12V and resistance is 4 ohms, what is current in Amperes? Press 1 for 48A, 2 for 3A, 3 for 8A.",
  },
  {
    id: "chemistry-atoms",
    subject: "Chemistry",
    title: "Atomic Structure & Periodic Table",
    description: "Protons, neutrons, electrons, valency, and basic chemical bonding.",
    gradeLevel: "Grade 8-10",
    keypadPromptSample: "What is the atomic number of Carbon? Press 1 for 4, 2 for 6, 3 for 8, 4 for 12.",
  },
  {
    id: "english-grammar",
    subject: "English",
    title: "Tenses & Active/Passive Voice",
    description: "Mastering simple, continuous, and perfect tenses for speaking and writing.",
    gradeLevel: "All Grades",
    keypadPromptSample: "Choose the correct past continuous sentence. Press 1 for 'He was playing', Press 2 for 'He is played'.",
  },
  {
    id: "english-spoken",
    subject: "Spoken English",
    title: "Daily Conversational Phrases",
    description: "Everyday dialogues, interview introductions, and polite requests.",
    gradeLevel: "Vocational & Practical",
    keypadPromptSample: "How do you politely ask for help in an office? Press 1 for 'Hey do this', Press 2 for 'Could you please help me with this?'.",
  },
];

