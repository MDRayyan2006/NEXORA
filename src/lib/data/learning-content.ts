/**
 * NEXORA Learning Content Library
 * 
 * Curated educational resources (Videos, Textbook Lessons, Formulas, Job Skills)
 * Delivered via both Keypad Phone Audio Calls and Web Interactive Dashboard.
 */

export interface LearningResource {
  id: string;
  topicId: string;
  title: string;
  subject: string;
  gradeLevel: string;
  category: "Mathematics" | "Physics" | "Chemistry" | "English" | "Vocational Skills";
  summary: string;
  
  // Textbook Content
  textbook: {
    corePrinciples: string[];
    formulaSheet: string[];
    workedExample: {
      problem: string;
      stepByStep: string[];
      solution: string;
    };
    commonMistakes: string[];
    realWorldApplication: string;
  };
  
  // Curated Video Lecture
  video: {
    title: string;
    channel: string;
    youtubeId: string; // Embedded video ID
    duration: string;
    thumbnailUrl: string;
  };
  
  // Associated Job & Employment Skills
  jobSkills: {
    skillName: string;
    competencyLevel: "Foundational" | "Applied" | "Advanced";
    targetJobRoles: string[];
  }[];
  
  // Keypad Oral Call Assessment
  callAssessment: {
    audioQuestion: string;
    options: { digit: number; text: string }[];
    correctDigit: number;
    explanation: string;
  }[];
}

export const LEARNING_RESOURCES: LearningResource[] = [
  {
    id: "math-percentages",
    topicId: "percentages",
    title: "Percentages, Discounts & Commercial Ratios",
    subject: "Mathematics",
    gradeLevel: "Grade 6-9 & Vocational",
    category: "Mathematics",
    summary: "Learn how to calculate retail discounts, sales tax, ratio divisions, and profit/loss percentages with intuitive mental math.",
    textbook: {
      corePrinciples: [
        "Percentage means 'out of 100'. A percentage is simply a ratio with 100 as the denominator.",
        "To find X% of a number N, multiply N by (X / 100).",
        "Discounts subtract from the original price: Final Price = Original Price - (Original Price * Discount%).",
        "A ratio A:B splits a total into (A + B) equal parts.",
      ],
      formulaSheet: [
        "Percentage = (Part / Whole) * 100",
        "Discounted Price = Marked Price * (1 - Discount% / 100)",
        "Profit% = (Profit / Cost Price) * 100",
      ],
      workedExample: {
        problem: "A shop offers a 20% festival discount on a shirt marked at ₹750. What is the customer's final price?",
        stepByStep: [
          "Step 1: Calculate 10% of ₹750 by moving the decimal point one place left = ₹75.",
          "Step 2: Since 20% is double of 10%, calculate 2 * ₹75 = ₹150 discount.",
          "Step 3: Subtract the discount amount from the marked price: ₹750 - ₹150 = ₹600.",
        ],
        solution: "The final discounted price is ₹600.",
      },
      commonMistakes: [
        "Dividing by the discounted price instead of the original cost price.",
        "Confusing percentage increase with percentage decrease.",
      ],
      realWorldApplication: "Crucial for cash register operations, billing counter sales, invoice auditing, and personal loan calculations.",
    },
    video: {
      title: "Percentages Made Easy - Fast Mental Math Tricks",
      channel: "Khan Academy India",
      youtubeId: "rR95CmbEb6U",
      duration: "9:42",
      thumbnailUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80",
    },
    jobSkills: [
      {
        skillName: "Commercial Cashier Billing & Discount Calculation",
        competencyLevel: "Applied",
        targetJobRoles: ["Retail Cashier", "Store Billing Executive", "Inventory Clerk"],
      },
      {
        skillName: "Financial Ledger Bookkeeping",
        competencyLevel: "Foundational",
        targetJobRoles: ["Accounts Assistant", "Microfinance Field Agent"],
      },
    ],
    callAssessment: [
      {
        audioQuestion: "What is 20 percent of 150 rupees? Press your phone keypad to answer.",
        options: [
          { digit: 1, text: "25 rupees" },
          { digit: 2, text: "30 rupees" },
          { digit: 3, text: "35 rupees" },
          { digit: 4, text: "40 rupees" },
        ],
        correctDigit: 2,
        explanation: "10% of 150 is 15. Therefore, 20% is 15 multiplied by 2, which equals 30.",
      },
      {
        audioQuestion: "If an item of 500 rupees has a 10 percent discount, how much discount do you get?",
        options: [
          { digit: 1, text: "50 rupees" },
          { digit: 2, text: "100 rupees" },
          { digit: 3, text: "25 rupees" },
          { digit: 4, text: "5 rupees" },
        ],
        correctDigit: 1,
        explanation: "10% of 500 is calculated as 500 divided by 10, giving 50 rupees discount.",
      },
    ],
  },
  {
    id: "math-linear-eq",
    topicId: "linear-eq",
    title: "Linear Equations & Practical Algebra",
    subject: "Mathematics",
    gradeLevel: "Grade 8-10 & Technician",
    category: "Mathematics",
    summary: "Master the balance-scale method to isolate variables, solve for unknowns in everyday business and technical scenarios.",
    textbook: {
      corePrinciples: [
        "An equation is a balanced scale: whatever operation you perform on one side, you must perform on the other side.",
        "Inverse operations isolate the variable: addition undoes subtraction; multiplication undoes division.",
        "Always group like terms (terms with the variable on one side, constants on the other).",
      ],
      formulaSheet: [
        "ax + b = c  =>  ax = c - b  =>  x = (c - b) / a",
      ],
      workedExample: {
        problem: "Solve for x in: 3x - 7 = 14",
        stepByStep: [
          "Step 1: Add 7 to both sides of the equation to eliminate -7: 3x = 14 + 7.",
          "Step 2: Simplify the right side: 3x = 21.",
          "Step 3: Divide both sides by 3 to isolate x: x = 21 / 3 = 7.",
        ],
        solution: "x = 7. Verification: 3(7) - 7 = 21 - 7 = 14 (Correct).",
      },
      commonMistakes: [
        "Sign flip error: forgetting to change a positive sign to negative when transposing across the equal sign.",
        "Dividing only part of the right side instead of the entire expression.",
      ],
      realWorldApplication: "Determining break-even units for street vendors, calculating electricity bill rates, and sizing component loads.",
    },
    video: {
      title: "Algebra Basics: Solving 2-Step Equations",
      channel: "Math Antics",
      youtubeId: "LDIiYKYvvdA",
      duration: "10:29",
      thumbnailUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80",
    },
    jobSkills: [
      {
        skillName: "Quantitative Problem-Solving & Metric Forecasting",
        competencyLevel: "Applied",
        targetJobRoles: ["Data Entry Operator", "Quality Control Inspector", "Logistics Assistant"],
      },
    ],
    callAssessment: [
      {
        audioQuestion: "If 3x + 5 equals 20, what is the value of x?",
        options: [
          { digit: 1, text: "3" },
          { digit: 2, text: "5" },
          { digit: 3, text: "15" },
          { digit: 4, text: "25" },
        ],
        correctDigit: 2,
        explanation: "Subtract 5 from 20 to get 15. Then divide 15 by 3 to find x = 5.",
      },
    ],
  },
  {
    id: "science-electricity",
    topicId: "ohms-law",
    title: "Electric Current, Voltage & Ohm's Law",
    subject: "Physics",
    gradeLevel: "Grade 9-12 & Electrician",
    category: "Physics",
    summary: "Understand the fundamental relationship between Voltage (Volts), Current (Amperes), and Resistance (Ohms) in circuits.",
    textbook: {
      corePrinciples: [
        "Voltage (V) is electrical pressure pushing electrons through a conductor.",
        "Current (I) is the flow rate of charge, measured in Amperes.",
        "Resistance (R) opposes the flow of current, measured in Ohms (Ω).",
        "Ohm's Law states that current is directly proportional to voltage and inversely proportional to resistance.",
      ],
      formulaSheet: [
        "V = I * R (Volts = Amps * Ohms)",
        "I = V / R",
        "R = V / I",
        "Power (Watts) = V * I",
      ],
      workedExample: {
        problem: "A 12-Volt car battery powers a headlight bulb with a resistance of 4 Ohms. What current flows through the circuit?",
        stepByStep: [
          "Step 1: Identify given values: Voltage V = 12 Volts, Resistance R = 4 Ohms.",
          "Step 2: Choose Ohm's law formula for current: I = V / R.",
          "Step 3: Calculate: I = 12 / 4 = 3 Amperes.",
        ],
        solution: "Current flowing through the headlight bulb is 3 Amperes.",
      },
      commonMistakes: [
        "Multiplying voltage by resistance instead of dividing when finding current.",
        "Neglecting unit prefixes (e.g. converting kilo-ohms 1kΩ to 1000Ω).",
      ],
      realWorldApplication: "Selecting correct fuse ratings, troubleshooting solar home systems, rewiring appliances, and mobile phone battery chargers.",
    },
    video: {
      title: "Ohm's Law Explained: Circuit Voltage, Current, Resistance",
      channel: "The Engineering Mindset",
      youtubeId: "HsLLq6Rm5qc",
      duration: "8:51",
      thumbnailUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
    },
    jobSkills: [
      {
        skillName: "Electrical Circuit Diagnostics & Multimeter Testing",
        competencyLevel: "Applied",
        targetJobRoles: ["Electrician Apprentice", "Solar Technician", "HVAC Assistant", "Electronics Repairer"],
      },
    ],
    callAssessment: [
      {
        audioQuestion: "If voltage is 12 Volts and resistance is 4 Ohms, what is the current in Amperes?",
        options: [
          { digit: 1, text: "48 Amperes" },
          { digit: 2, text: "3 Amperes" },
          { digit: 3, text: "8 Amperes" },
          { digit: 4, text: "16 Amperes" },
        ],
        correctDigit: 2,
        explanation: "Current equals Voltage divided by Resistance: 12 divided by 4 equals 3 Amperes.",
      },
    ],
  },
  {
    id: "science-motion",
    topicId: "newtons-laws",
    title: "Newton's Laws of Motion & Vehicle Safety",
    subject: "Physics",
    gradeLevel: "Grade 9-11",
    category: "Physics",
    summary: "Inertia, momentum, action-reaction forces, and their life-saving implications in bicycles, buses, and mechanics.",
    textbook: {
      corePrinciples: [
        "First Law (Inertia): An object remains at rest or uniform motion unless acted upon by a net external force.",
        "Second Law: Force equals mass times acceleration (F = m * a). More mass requires more force to accelerate.",
        "Third Law: For every action, there is an equal and opposite reaction.",
      ],
      formulaSheet: [
        "F = m * a (Force in Newtons = mass in kg * acceleration in m/s²)",
        "Momentum p = m * v",
      ],
      workedExample: {
        problem: "Why does a passenger jerk forward when an auto-rickshaw or bus suddenly slams on the brakes?",
        stepByStep: [
          "Step 1: The passenger's body is moving forward at the speed of the bus.",
          "Step 2: When the driver brakes, friction acts on the bus tires, stopping the bus chassis.",
          "Step 3: By Newton's First Law (Inertia), the passenger's upper body continues moving forward at the previous speed until an external force (seatbelt or holding bar) stops it.",
        ],
        solution: "This is a direct demonstration of Inertia of Motion.",
      },
      commonMistakes: [
        "Believing an object requires continuous force to stay in motion (neglecting friction).",
        "Assuming action-reaction force pairs cancel each other out (they act on different bodies).",
      ],
      realWorldApplication: "Safe vehicle driving, understanding braking distances on wet roads, crane lifting safety, and playground swings.",
    },
    video: {
      title: "Newton's Laws of Motion Illustrated",
      channel: "Physics Girl",
      youtubeId: "kKKM8Y-u7ds",
      duration: "7:15",
      thumbnailUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80",
    },
    jobSkills: [
      {
        skillName: "Mechanical Safety Compliance & Workshop Dynamics",
        competencyLevel: "Foundational",
        targetJobRoles: ["Automotive Mechanic Assistant", "Warehouse Forklift Operator", "Industrial Safety Helper"],
      },
    ],
    callAssessment: [
      {
        audioQuestion: "Which law explains why you lurch forward when a bus suddenly brakes?",
        options: [
          { digit: 1, text: "Newton's First Law (Inertia)" },
          { digit: 2, text: "Newton's Second Law (Force)" },
          { digit: 3, text: "Newton's Third Law (Reaction)" },
          { digit: 4, text: "Law of Gravity" },
        ],
        correctDigit: 1,
        explanation: "Newton's First Law states that bodies in motion stay in motion due to inertia until stopped by an external force.",
      },
    ],
  },
  {
    id: "english-spoken",
    topicId: "spoken-english",
    title: "Professional Spoken English & Workplace Communication",
    subject: "Spoken English",
    gradeLevel: "Vocational & Practical",
    category: "English",
    summary: "Clear sentence construction, telephone etiquette, polite requests, and confident job interview introductions.",
    textbook: {
      corePrinciples: [
        "Polite requests use modal verbs like 'Could', 'Would', and 'May' rather than blunt commands.",
        "Telephone greeting structure: (1) Greeting + (2) Identity introduction + (3) Purpose of call + (4) Polite signoff.",
        "Active listening confirmation: Use phrases like 'Certainly', 'I understand', 'Allow me to check that for you'.",
      ],
      formulaSheet: [
        "Polite Request: Could you please + [Base Verb] + [Object]?",
        "Self Introduction: Hello, my name is [Name]. I have completed training in [Skill] and I am applying for [Role].",
      ],
      workedExample: {
        problem: "Transform the harsh phrase 'Give me the file now' into professional corporate communication.",
        stepByStep: [
          "Step 1: Replace command imperative with polite request modal 'Could you please...'.",
          "Step 2: Add time courtesy 'when you have a moment'.",
          "Step 3: Full phrase: 'Could you please share the file when you have a moment?'",
        ],
        solution: "Result is polite, professional, and establishes mutual respect.",
      },
      commonMistakes: [
        "Translating idioms word-for-word from mother tongue without matching English grammar order.",
        "Using informal slang in customer-facing telephone conversations.",
      ],
      realWorldApplication: "Customer support desks, receptionist desks, BPO call centers, delivery partner communication, and client meetings.",
    },
    video: {
      title: "Spoken English for Beginners - Daily Conversation Sentences",
      channel: "Oxford Online English",
      youtubeId: "n4NVPg2kHv4",
      duration: "14:20",
      thumbnailUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80",
    },
    jobSkills: [
      {
        skillName: "Professional Customer Telephone & Front-Desk Etiquette",
        competencyLevel: "Applied",
        targetJobRoles: ["Customer Support Executive", "Front Desk Receptionist", "Sales Associate", "Telecaller"],
      },
      {
        skillName: "Workplace English Conversational Fluency",
        competencyLevel: "Foundational",
        targetJobRoles: ["Hospitality Assistant", "Call Center Associate"],
      },
    ],
    callAssessment: [
      {
        audioQuestion: "How do you politely ask a colleague or customer for help? Press 1 or 2.",
        options: [
          { digit: 1, text: "Hey do this right now" },
          { digit: 2, text: "Could you please help me with this?" },
        ],
        correctDigit: 2,
        explanation: "Using 'Could you please...' is the accepted professional and respectful standard.",
      },
    ],
  },
];

