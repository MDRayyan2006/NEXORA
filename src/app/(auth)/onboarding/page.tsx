"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Spinner, Progress } from "@/components/ui";

const DOMAIN_OPTIONS = [
  {
    id: "math",
    title: "Commercial Mathematics & Percentages",
    desc: "Retail discounts, ratio calculations, profit/loss, mental arithmetic",
    icon: "📐",
    defaultTopic: "Percentages & Commercial Ratios",
  },
  {
    id: "physics",
    title: "Applied Physics & Ohm's Law",
    desc: "Circuit voltage/current diagnostics, electrical safety, Newton's laws",
    icon: "⚡",
    defaultTopic: "Ohm's Law & Circuit Diagnostics",
  },
  {
    id: "english",
    title: "Professional Spoken English",
    desc: "Customer communication, workplace etiquette, phone greetings, interview skills",
    icon: "🗣️",
    defaultTopic: "Professional Spoken English",
  },
  {
    id: "cs",
    title: "Computer Science & Digital Skills",
    desc: "Logical algorithms, basic coding, data entry, numerical problem-solving",
    icon: "💻",
    defaultTopic: "Algorithms & Logic",
  },
];

const LEVEL_OPTIONS = [
  {
    level: "Beginner",
    label: "🌱 Beginner — Starting Fresh",
    desc: "I want intuitive first-principles explanations and clear foundation checks.",
  },
  {
    level: "Intermediate",
    label: "⚡ Intermediate — Have Basic Working Knowledge",
    desc: "I know the high-level terms but want to diagnose and fix conceptual gaps.",
  },
  {
    level: "Advanced",
    label: "🎓 Advanced — Rigorous & Cross-Domain",
    desc: "I am ready for challenging diagnostics, bridge missions, and skill transfer.",
  },
];

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: string;
  explanation: string;
  concept: string;
}

export default function OnboardingPage() {
  const router = useRouter();

  // Wizard steps: 1=Goal, 2=Level, 3=Test, 4=Results
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Selections
  const [selectedDomain, setSelectedDomain] = useState<string>("math");
  const [customGoal, setCustomGoal] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("Intermediate");
  const [userMode, setUserMode] = useState<"keypad" | "web">("web");

  // Quiz State
  const [generatingQuiz, setGeneratingQuiz] = useState<boolean>(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState<number>(0);

  const getTopic = () => {
    if (customGoal.trim()) return customGoal.trim();
    const found = DOMAIN_OPTIONS.find((d) => d.id === selectedDomain);
    return found?.defaultTopic || "Calculus & Optimization";
  };

  // Step 2 -> Step 3: Trigger Live Gemini Quiz Generation
  const handleStartTest = async () => {
    setGeneratingQuiz(true);
    setStep(3);

    const topic = getTopic();

    try {
      const res = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          level: selectedLevel,
          count: 3,
        }),
      });

      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      }
    } catch (e) {
      console.error("Quiz generation error:", e);
    } finally {
      setGeneratingQuiz(false);
    }
  };

  const handleSelectOption = (opt: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIdx]: opt,
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      // Complete Test
      let calculatedScore = 0;
      questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correct) {
          calculatedScore += 1;
        }
      });
      setScore(calculatedScore);

      // Save user onboarding data in local storage and profile
      const topic = getTopic();
      const initialMastery = (calculatedScore / questions.length) * 0.8 + 0.1;

      const baselineData = {
        hasOnboarded: true,
        topic,
        domain: selectedDomain,
        level: selectedLevel,
        score: calculatedScore,
        totalQuestions: questions.length,
        initialMastery: Math.round(initialMastery * 100),
        completedAt: new Date().toISOString(),
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("nexora_onboarding", JSON.stringify(baselineData));
        localStorage.setItem("nexora_user_mode", userMode);
      }

      // Also persist to API
      fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          career_interests: [topic],
          education_level: selectedLevel,
          bio: `Focused on mastering ${topic} (${selectedLevel} baseline).`,
        }),
      }).catch(() => {});

      setStep(4);
    }
  };

  const handleFinishToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="max-w-2xl w-full space-y-8">
        {/* Progress Header */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Learner Baseline Intake</span>
            <span>Step {step} of 4</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-500 transition-all duration-300 rounded-full"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: WHAT DO YOU WANT TO LEARN? */}
        {step === 1 && (
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                1. Goal Discovery
              </span>
              <h1 className="text-2xl font-bold text-slate-900">What would you like to master?</h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Nexora does not assume your capability from age or grade. Choose what you want to learn so we can build your personalized capability graph.
              </p>
            </div>

            {/* Learning Device Mode Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Your Primary Learning Channel:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setUserMode("keypad")}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    userMode === "keypad"
                      ? "border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📱</span>
                    <span className="font-bold text-xs text-slate-900">Keypad / Basic Phone</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Daily automated AI phone calls + oral keypad tests (1, 2, 3, 4). Zero internet needed.
                  </p>
                </div>

                <div
                  onClick={() => setUserMode("web")}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    userMode === "web"
                      ? "border-teal-500 bg-teal-50/50 ring-2 ring-teal-500/20"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">💻</span>
                    <span className="font-bold text-xs text-slate-900">Website & Smartphone</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Full skills dashboard, video lectures, textbook notes, and auto-resume builder.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Choose Topic to Learn:
              </label>
            </div>

            <div className="space-y-3">
              {DOMAIN_OPTIONS.map((d) => {
                const isSelected = selectedDomain === d.id && !customGoal.trim();
                return (
                  <div
                    key={d.id}
                    onClick={() => {
                      setSelectedDomain(d.id);
                      setCustomGoal("");
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? "border-teal-500 bg-teal-50/40 ring-2 ring-teal-500/20"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <span className="text-2xl">{d.icon}</span>
                    <div className="flex-1">
                      <p className="font-bold text-sm text-slate-900">{d.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{d.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Or enter a custom domain / focus:
              </label>
              <input
                type="text"
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
                placeholder="e.g. Quantum Computing, Embedded Systems, Vector Calculus..."
                className="w-full text-xs sm:text-sm border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <Button
              variant="primary"
              onClick={() => setStep(2)}
              className="w-full py-3 text-sm font-bold"
            >
              Continue to Knowledge Self-Assessment →
            </Button>
          </Card>
        )}

        {/* STEP 2: WHAT IS YOUR EXPERIENCE LEVEL? */}
        {step === 2 && (
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                2. Self-Reported Baseline
              </span>
              <h1 className="text-2xl font-bold text-slate-900">
                What is your current familiarity with {getTopic()}?
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                This helps our Gemini assessment engine calibrate diagnostic question difficulty to find your prerequisite boundary.
              </p>
            </div>

            <div className="space-y-3">
              {LEVEL_OPTIONS.map((lvl) => {
                const isSelected = selectedLevel === lvl.level;
                return (
                  <div
                    key={lvl.level}
                    onClick={() => setSelectedLevel(lvl.level)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? "border-teal-500 bg-teal-50/40 ring-2 ring-teal-500/20"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <p className="font-bold text-sm text-slate-900">{lvl.label}</p>
                    <p className="text-xs text-slate-500 mt-1">{lvl.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="ghost" onClick={() => setStep(1)} className="w-1/3">
                ← Back
              </Button>
              <Button variant="primary" onClick={handleStartTest} className="w-2/3 py-3 text-sm font-bold">
                Generate Diagnostic Assessment →
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 3: LIVE GEMINI DIAGNOSTIC TEST */}
        {step === 3 && (
          <Card className="p-6 sm:p-8 space-y-6">
            {generatingQuiz ? (
              <div className="py-16 text-center space-y-4">
                <Spinner size={40} />
                <div>
                  <h3 className="font-bold text-slate-800 text-base">
                    Generating Tailored Diagnostic with Gemini AI...
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Synthesizing targeted assessment questions for: {getTopic()} ({selectedLevel})
                  </p>
                </div>
              </div>
            ) : questions.length > 0 ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <Badge variant="info" className="text-xs">
                    Target: {getTopic()}
                  </Badge>
                  <span className="text-xs font-semibold text-slate-400">
                    Question {currentQuestionIdx + 1} of {questions.length}
                  </span>
                </div>

                <div className="space-y-4">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {questions[currentQuestionIdx]?.question}
                  </h2>

                  <div className="space-y-2.5">
                    {questions[currentQuestionIdx]?.options.map((opt, i) => {
                      const isChosen = selectedAnswers[currentQuestionIdx] === opt;
                      return (
                        <div
                          key={i}
                          onClick={() => handleSelectOption(opt)}
                          className={`p-3.5 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all flex items-center gap-3 ${
                            isChosen
                              ? "border-teal-500 bg-teal-50/60 font-semibold text-teal-900"
                              : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              isChosen ? "border-teal-600 bg-teal-600" : "border-slate-300"
                            }`}
                          >
                            {isChosen && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <span>{opt}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    variant="primary"
                    disabled={!selectedAnswers[currentQuestionIdx]}
                    onClick={handleNextQuestion}
                    className="py-2.5 px-6 font-bold text-sm"
                  >
                    {currentQuestionIdx < questions.length - 1 ? "Next Question →" : "Calculate My Capability Baseline →"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center space-y-4">
                <p className="text-sm text-slate-600">
                  Unable to reach Gemini API endpoint directly. Proceeding with standard curriculum baseline.
                </p>
                <Button variant="primary" onClick={() => setStep(4)}>
                  Continue to Results →
                </Button>
              </div>
            )}
          </Card>
        )}

        {/* STEP 4: REAL BASELINE SYNTHESIS & DASHBOARD TRANSITION */}
        {step === 4 && (
          <Card className="p-6 sm:p-8 space-y-6 text-center animate-fade-in">
            <span className="text-5xl">⚡</span>
            <div className="space-y-2">
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Assessment Complete
              </span>
              <h1 className="text-2xl font-bold text-slate-900">
                Your Initial Capability Baseline is Ready
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                No mock scores. Your learning graph is customized to your actual responses on {getTopic()}.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 grid grid-cols-3 gap-4">
              <div>
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {score}/{questions.length || 3}
                </span>
                <span className="block text-xs text-slate-500 mt-1">Diagnostic Score</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-teal-600">
                  {Math.round(((score || 1) / (questions.length || 3)) * 80 + 10)}%
                </span>
                <span className="block text-xs text-slate-500 mt-1">Starting Mastery</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-navy-700">
                  {score >= 2 ? "Solid" : "Developing"}
                </span>
                <span className="block text-xs text-slate-500 mt-1">Foundations</span>
              </div>
            </div>

            <div className="text-left bg-teal-50/50 border border-teal-200 rounded-xl p-4 text-xs text-teal-900 space-y-1">
              <p className="font-bold">🎯 Initial Learning Path Calibrated:</p>
              <p className="text-teal-800">
                We have initialized your Concept Workspace for <strong>{getTopic()}</strong>. We will guide you step-by-step through prerequisite dependencies, award XP as you verify capabilities, and connect your progress to real opportunities.
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleFinishToDashboard}
              className="w-full py-3.5 font-bold text-base"
            >
              Enter My Personalized Learning Workspace →
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}

