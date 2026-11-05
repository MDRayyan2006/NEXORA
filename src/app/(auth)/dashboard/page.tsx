"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Button,
  Avatar,
  Progress,
} from "@/components/ui";
import { REAL_CURRICULUM } from "@/lib/data/curriculum";
import { LEARNING_RESOURCES } from "@/lib/data/learning-content";

interface DemonstratedSkill {
  name: string;
  category: string;
  masteryPercent: number; // 0-100
  verifiedVia: "Call Keypad Test" | "WhatsApp Review" | "Diagnostic Quiz";
  status: "Mastered" | "In Progress" | "Scheduled Next";
}

const INITIAL_SKILLS: DemonstratedSkill[] = [
  {
    name: "Commercial Percentages & Retail Discounts",
    category: "Mathematics",
    masteryPercent: 88,
    verifiedVia: "Call Keypad Test",
    status: "Mastered",
  },
  {
    name: "Linear Equations & Algebraic Balance",
    category: "Mathematics",
    masteryPercent: 74,
    verifiedVia: "Diagnostic Quiz",
    status: "In Progress",
  },
  {
    name: "Ohm's Law & Circuit Diagnostics",
    category: "Physics",
    masteryPercent: 92,
    verifiedVia: "Call Keypad Test",
    status: "Mastered",
  },
  {
    name: "Newton's Laws & Mechanical Inertia",
    category: "Physics",
    masteryPercent: 65,
    verifiedVia: "Diagnostic Quiz",
    status: "In Progress",
  },
  {
    name: "Professional Telephone Etiquette & Requests",
    category: "Spoken English",
    masteryPercent: 82,
    verifiedVia: "Call Keypad Test",
    status: "Mastered",
  },
  {
    name: "Atomic Structure & Chemical Valency",
    category: "Chemistry",
    masteryPercent: 40,
    verifiedVia: "Diagnostic Quiz",
    status: "Scheduled Next",
  },
];

export default function DashboardPage() {
  const [userName, setUserName] = useState("Learner");
  const [phoneNumber, setPhoneNumber] = useState("+91 98765 43210");
  const [scheduledTime, setScheduledTime] = useState("18:30");
  const [callActive, setCallActive] = useState(true);
  const [currentTopic, setCurrentTopic] = useState("Percentages & Ratios");
  const [callLanguage, setCallLanguage] = useState("en");

  // Mode: "web" (Website & Smartphone) vs "keypad" (Feature/Keypad phone)
  const [userMode, setUserMode] = useState<"web" | "keypad">("web");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("nexora_user_name");
      if (storedName) setUserName(storedName);

      const storedMode = localStorage.getItem("nexora_user_mode");
      if (storedMode === "keypad" || storedMode === "web") {
        setUserMode(storedMode);
      }

      const storedOnboarding = localStorage.getItem("nexora_onboarding");
      if (storedOnboarding) {
        try {
          const parsed = JSON.parse(storedOnboarding);
          if (parsed.topic) setCurrentTopic(parsed.topic);
        } catch {}
      }
    }

    // Fetch phone schedule
    async function loadSchedule() {
      try {
        const res = await fetch("/api/calls/schedule");
        const data = await res.json();
        if (data.schedule) {
          setPhoneNumber(data.schedule.phoneNumber || "+91 98765 43210");
          setScheduledTime(data.schedule.preferredTime || "18:30");
          setCallActive(data.schedule.enabled ?? true);
          if (data.schedule.topic) setCurrentTopic(data.schedule.topic);
          if (data.schedule.language) setCallLanguage(data.schedule.language);
        }
      } catch {}
    }
    loadSchedule();
  }, []);

  const handleToggleMode = (mode: "web" | "keypad") => {
    setUserMode(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem("nexora_user_mode", mode);
    }
  };

  const masteredCount = INITIAL_SKILLS.filter((s) => s.status === "Mastered").length;
  const avgMastery = Math.round(
    INITIAL_SKILLS.reduce((acc, s) => acc + s.masteryPercent, 0) / INITIAL_SKILLS.length
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header & Mode Toggle */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <Avatar name={userName} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">
                  Welcome, {userName}! 👋
                </h1>
                <Badge variant={userMode === "keypad" ? "warning" : "success"}>
                  {userMode === "keypad" ? "📱 Keypad Phone Mode" : "💻 Web Student Mode"}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Current Learning Focus:{" "}
                <span className="font-semibold text-teal-700">{currentTopic}</span>
              </p>
            </div>
          </div>

          {/* User Mode Switcher */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start md:self-auto">
            <button
              onClick={() => handleToggleMode("web")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                userMode === "web"
                  ? "bg-white text-teal-800 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>💻</span>
              <span>Web Student View</span>
            </button>
            <button
              onClick={() => handleToggleMode("keypad")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                userMode === "keypad"
                  ? "bg-amber-500 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>📱</span>
              <span>Keypad Phone View</span>
            </button>
          </div>
        </div>

        {/* ── KEYPAD STUDENT VIEW ────────────────────────────────────── */}
        {userMode === "keypad" && (
          <div className="space-y-6">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-center gap-3">
              <span className="text-2xl">📱</span>
              <div>
                <p className="font-bold">Keypad / Feature Phone Mode Active</p>
                <p className="text-amber-800 mt-0.5">
                  Optimized for basic phones without high-speed internet. All lessons and tests are delivered by automated voice phone calls at your scheduled time.
                </p>
              </div>
            </div>

            {/* Scheduled Call Banner */}
            <div className="bg-gradient-to-br from-[#152d4a] to-[#0f766e] rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                    Daily Telephony Schedule
                  </span>
                  <h2 className="text-2xl font-extrabold mt-1">Next AI Learning Call</h2>
                </div>
                <div className="flex gap-2">
                  <Badge variant="success" className="text-xs px-3 py-1">
                    ⏰ Today at {scheduledTime}
                  </Badge>
                  <Badge variant="info" className="text-xs px-3 py-1 font-mono">
                    📞 {phoneNumber}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur">
                  <p className="text-xs text-teal-200">Scheduled Topic</p>
                  <p className="text-base font-bold mt-1 truncate">{currentTopic}</p>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur">
                  <p className="text-xs text-teal-200">Oral Test Format</p>
                  <p className="text-base font-bold mt-1">Keypad Digits (1, 2, 3, 4)</p>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur">
                  <p className="text-xs text-teal-200">Spoken Voice Language</p>
                  <p className="text-base font-bold mt-1">
                    {callLanguage === "te" ? "Telugu (తెలుగు)" : callLanguage === "hi" ? "Hindi (हिंदी)" : "English"}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3 justify-end">
                <Link href="/call-tutor">
                  <Button variant="primary" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-2.5">
                    📞 Open Phone Tutor & Dial My Phone Now →
                  </Button>
                </Link>
              </div>
            </div>

            {/* Keypad Test History */}
            <Card className="p-6 space-y-4">
              <CardTitle className="text-base font-bold text-slate-900">
                Keypad Oral Test Logs (DTMF Responses)
              </CardTitle>
              <div className="space-y-3">
                {[
                  {
                    topic: "Percentages & Ratios",
                    date: "Today's Call",
                    q1: "Correct (Pressed 2)",
                    q2: "Correct (Pressed 1)",
                    score: "2/2 (100%)",
                  },
                  {
                    topic: "Ohm's Law & Electricity",
                    date: "Yesterday's Call",
                    q1: "Correct (Pressed 2)",
                    q2: "Correct (Pressed 3)",
                    score: "2/2 (100%)",
                  },
                  {
                    topic: "Newton's Laws of Motion",
                    date: "2 Days Ago",
                    q1: "Correct (Pressed 1)",
                    q2: "Incorrect (Pressed 3, Ans was 2)",
                    score: "1/2 (50%)",
                  },
                ].map((log, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">
                        {log.topic}
                      </span>
                      <span className="text-slate-400 text-[11px]">{log.date}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-slate-600">
                        <span>Q1: {log.q1}</span> • <span>Q2: {log.q2}</span>
                      </div>
                      <Badge variant="success" className="font-bold">
                        {log.score}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ── WEB STUDENT VIEW (SKILLS MATRIX & CORE CHANNELS) ───────── */}
        {userMode === "web" && (
          <div className="space-y-8">
            {/* Quick Primary Actions: 3 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Keypad Phone Tutor */}
              <Card className="p-6 border-teal-200 hover:shadow-lg transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl">📞</span>
                    <Badge variant="info" className="text-[10px]">
                      Daily at {scheduledTime}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">
                    AI Phone Call Tutor
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    AI calls your phone, speaks lessons out loud in your language, and tests you via keypad buttons.
                  </p>
                </div>
                <Link href="/call-tutor">
                  <Button variant="primary" size="sm" className="w-full text-xs font-bold">
                    Schedule & Test Call →
                  </Button>
                </Link>
              </Card>

              {/* Card 2: WhatsApp Doubt Assistant */}
              <Card className="p-6 border-emerald-200 hover:shadow-lg transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl">💬</span>
                    <Badge variant="success" className="text-[10px]">
                      24/7 AI Tutor
                    </Badge>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">
                    WhatsApp Doubt & Homework
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Submit homework questions for rubric review, mistake analysis, and step-by-step hints without spoilers.
                  </p>
                </div>
                <Link href="/whatsapp">
                  <Button variant="secondary" size="sm" className="w-full text-xs font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200">
                    Open WhatsApp Bot →
                  </Button>
                </Link>
              </Card>

              {/* Card 3: Auto-Generated Resume */}
              <Card className="p-6 border-slate-200 hover:shadow-lg transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl">📄</span>
                    <Badge variant="info" className="text-[10px]">
                      Auto-Updated
                    </Badge>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">
                    AI Resume & Job Form Filler
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Automatically builds an ATS-ready resume and auto-fills job application forms from skills you've mastered.
                  </p>
                </div>
                <Link href="/resume">
                  <Button variant="secondary" size="sm" className="w-full text-xs font-bold">
                    View Verified Resume →
                  </Button>
                </Link>
              </Card>
            </div>

            {/* Skills Representation Matrix */}
            <Card className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Demonstrated Skills Representation Matrix
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live mastery tracking calibrated directly from oral keypad phone tests, diagnostic quizzes, and homework reviews.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Overall Mastery</span>
                    <span className="text-lg font-black text-teal-600">{avgMastery}%</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Mastered Skills</span>
                    <span className="text-lg font-black text-emerald-600">
                      {masteredCount} of {INITIAL_SKILLS.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Skills Progress Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {INITIAL_SKILLS.map((skill, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 hover:border-teal-300 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge variant="info" className="text-[10px] mb-1">
                          {skill.category}
                        </Badge>
                        <h3 className="text-sm font-bold text-slate-900 leading-snug">
                          {skill.name}
                        </h3>
                      </div>
                      <Badge
                        variant={
                          skill.status === "Mastered"
                            ? "success"
                            : skill.status === "In Progress"
                            ? "warning"
                            : "outline"
                        }
                        className="text-[10px]"
                      >
                        {skill.status}
                      </Badge>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                        <span>Mastery Progress</span>
                        <span>{skill.masteryPercent}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            skill.masteryPercent >= 80
                              ? "bg-emerald-500"
                              : skill.masteryPercent >= 60
                              ? "bg-teal-500"
                              : "bg-amber-400"
                          }`}
                          style={{ width: `${skill.masteryPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                      <span>Verified: {skill.verifiedVia}</span>
                      <Link href="/learn" className="text-teal-600 font-semibold hover:underline">
                        Review Notes & Videos →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Video & Textbook Resources Preview */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Curriculum Study Materials (Videos & Textbooks)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Watch short concept videos or read textbook summaries for upcoming daily calls.
                  </p>
                </div>
                <Link href="/learn">
                  <Button variant="ghost" size="sm" className="text-xs font-semibold text-teal-700">
                    Browse All Materials →
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {LEARNING_RESOURCES.slice(0, 3).map((res) => (
                  <Card key={res.id} className="overflow-hidden border-slate-200 p-0 flex flex-col justify-between">
                    <div>
                      <div className="h-32 w-full relative bg-slate-900">
                        <img
                          src={res.video.thumbnailUrl}
                          alt={res.title}
                          className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge variant="info" className="text-[9px] bg-slate-900/80 backdrop-blur text-teal-300">
                            {res.subject}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4 space-y-1.5">
                        <h4 className="font-bold text-xs text-slate-900 line-clamp-1">
                          {res.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-2">
                          {res.summary}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                      <Link href="/learn">
                        <Button size="sm" variant="secondary" className="text-[10px] py-1 px-2.5">
                          📖 Study Notes
                        </Button>
                      </Link>
                      <Link href="/call-tutor">
                        <Button size="sm" variant="ghost" className="text-[10px] py-1 px-2.5 text-teal-700">
                          📞 Schedule Call
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
