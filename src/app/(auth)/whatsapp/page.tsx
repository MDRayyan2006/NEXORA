"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge } from "@/components/ui";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  time: string;
  type?: "doubt" | "assignment" | "text";
  score?: number;
  verdict?: string;
  hint?: string;
}

export default function WhatsAppPage() {
  const [activeTab, setActiveTab] = useState<"doubt" | "assignment">("doubt");
  const [language, setLanguage] = useState<"en" | "te" | "hi" | "ta">("en");

  // Doubt form state
  const [doubtText, setDoubtText] = useState("");
  const [submittingDoubt, setSubmittingDoubt] = useState(false);

  // Assignment form state
  const [assignmentTitle, setAssignmentTitle] = useState("Algebra & Linear Equations");
  const [problemStatement, setProblemStatement] = useState("Solve for x: 3x - 7 = 14");
  const [studentSolution, setStudentSolution] = useState("3x = 14 - 7 = 7\nx = 7/3");
  const [submittingAssignment, setSubmittingAssignment] = useState(false);

  // Chat message history
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "bot",
      time: "10:00 AM",
      text: "👋 *Namaste! Welcome to Nexora WhatsApp Learning Assistant.*\n\nI am your 24/7 AI tutor on WhatsApp. You can:\n1️⃣ *Ask any academic doubt* (Text or voice)\n2️⃣ *Submit homework assignments* for step-by-step review and hint analysis\n\nHow can I help you today? 🚀",
      type: "text",
    },
  ]);

  // Handle Doubt Submission
  const handleSendDoubt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtText.trim()) return;

    const userMsg: ChatMessage = {
      id: "user-" + Date.now(),
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: doubtText,
      type: "doubt",
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentQuery = doubtText;
    setDoubtText("");
    setSubmittingDoubt(true);

    try {
      const res = await fetch("/api/whatsapp/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: currentQuery,
          language,
          studentName: "Student",
        }),
      });
      const data = await res.json();
      if (data.result) {
        const botMsg: ChatMessage = {
          id: "bot-" + Date.now(),
          sender: "bot",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: data.result.whatsappFormattedMessage,
          type: "doubt",
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: "err-" + Date.now(),
          sender: "bot",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: "⚠️ Unable to reach WhatsApp analysis server. Please try again.",
        },
      ]);
    } finally {
      setSubmittingDoubt(false);
    }
  };

  // Handle Assignment Submission
  const handleSendAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemStatement.trim() || !studentSolution.trim()) return;

    const userMsg: ChatMessage = {
      id: "user-" + Date.now(),
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: `*📋 Submitted Homework:* ${assignmentTitle}\n*Problem:* ${problemStatement}\n*My Solution:*\n${studentSolution}`,
      type: "assignment",
    };

    setMessages((prev) => [...prev, userMsg]);
    setSubmittingAssignment(true);

    try {
      const res = await fetch("/api/whatsapp/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentTitle,
          problemStatement,
          studentSolution,
          studentName: "Student",
        }),
      });
      const data = await res.json();
      if (data.result) {
        const botMsg: ChatMessage = {
          id: "bot-" + Date.now(),
          sender: "bot",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: data.result.whatsappFormattedMessage,
          type: "assignment",
          score: data.result.score,
          verdict: data.result.verdict,
          hint: data.result.pedagogicalHint,
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: "err-" + Date.now(),
          sender: "bot",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: "⚠️ Assignment review server is busy. Please try again in a moment.",
        },
      ]);
    } finally {
      setSubmittingAssignment(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">💬</span>
            <h1 className="text-2xl font-bold text-slate-900">
              WhatsApp Bot: Assignment Review & Doubt Analysis
            </h1>
            <Badge variant="success">WhatsApp Cloud API & Webhook</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Students solve doubts and get assignments reviewed right inside WhatsApp. Powered by Gemini AI with bilingual guidance and step-by-step hints without spoiling answers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: INTERACTION CONTROLS & WEBHOOK (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-bold text-slate-900">
                  Select WhatsApp Service Mode
                </CardTitle>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setActiveTab("doubt")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      activeTab === "doubt"
                        ? "bg-white text-emerald-700 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    💡 Doubt Analysis
                  </button>
                  <button
                    onClick={() => setActiveTab("assignment")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      activeTab === "assignment"
                        ? "bg-white text-emerald-700 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    📝 Assignment Review
                  </button>
                </div>
              </div>

              {/* Language selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Response Language
                </label>
                <select
                  value={language}
                  onChange={(e: any) => setLanguage(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="en">English</option>
                  <option value="te">Telugu (తెలుగు)</option>
                  <option value="hi">Hindi (हिंदी)</option>
                  <option value="ta">Tamil (தமிழ்)</option>
                </select>
              </div>

              {/* TAB 1: DOUBT ANALYSIS FORM */}
              {activeTab === "doubt" && (
                <form onSubmit={handleSendDoubt} className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Type Your Doubt / Question
                    </label>
                    <textarea
                      rows={3}
                      value={doubtText}
                      onChange={(e) => setDoubtText(e.target.value)}
                      placeholder="e.g. Why do we reverse the inequality sign when dividing by a negative number? Or ask in Telugu/Hindi."
                      required
                      className="w-full text-xs border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={submittingDoubt || !doubtText.trim()}
                      className="w-full py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      {submittingDoubt ? "Analyzing with Gemini..." : "Send Doubt to WhatsApp Bot 💬"}
                    </Button>
                  </div>
                </form>
              )}

              {/* TAB 2: ASSIGNMENT REVIEW FORM */}
              {activeTab === "assignment" && (
                <form onSubmit={handleSendAssignment} className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Assignment Title
                    </label>
                    <input
                      type="text"
                      value={assignmentTitle}
                      onChange={(e) => setAssignmentTitle(e.target.value)}
                      required
                      className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Problem Statement
                    </label>
                    <textarea
                      rows={2}
                      value={problemStatement}
                      onChange={(e) => setProblemStatement(e.target.value)}
                      placeholder="e.g. Solve for x: 3x - 7 = 14"
                      required
                      className="w-full text-xs border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Student's Attempted Steps / Solution
                    </label>
                    <textarea
                      rows={3}
                      value={studentSolution}
                      onChange={(e) => setStudentSolution(e.target.value)}
                      placeholder="e.g. Step 1: 3x = 14 - 7 = 7&#10;Step 2: x = 7/3"
                      required
                      className="w-full text-xs border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={submittingAssignment}
                    className="w-full py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    {submittingAssignment ? "Reviewing Assignment..." : "Submit for AI Rubric Review 📋"}
                  </Button>
                </form>
              )}
            </Card>

            {/* Quick Prompts to Try */}
            <Card className="p-5 space-y-3">
              <CardTitle className="text-xs font-bold text-slate-900">
                Sample Student Queries
              </CardTitle>
              <div className="space-y-2">
                {[
                  {
                    type: "doubt",
                    text: "How do I calculate 15% discount on a 800 rupee book?",
                  },
                  {
                    type: "doubt",
                    text: "నాల్గవ తరగతి భిన్నాలు (Fractions) సులభంగా ఎలా అర్థం చేసుకోవాలి?",
                  },
                  {
                    type: "assignment",
                    text: "Review: Solve 2x + 4 = 16. My answer is x = 10.",
                  },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (item.type === "doubt") {
                        setActiveTab("doubt");
                        setDoubtText(item.text);
                      } else {
                        setActiveTab("assignment");
                        setProblemStatement("Solve 2x + 4 = 16");
                        setStudentSolution("2x = 16 + 4 = 20 => x = 10");
                      }
                    }}
                    className="w-full text-left text-[11px] p-2 rounded-lg bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-100 transition-colors"
                  >
                    💬 {item.text}
                  </button>
                ))}
              </div>
            </Card>

            {/* Production Webhook Integration Details */}
            <Card className="p-5 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Live Webhook Endpoints
              </span>
              <p className="text-xs text-slate-600">
                Integrates with Meta WhatsApp Business Cloud API & Twilio:
              </p>
              <div className="bg-slate-900 text-slate-200 rounded-lg p-2.5 font-mono text-[10px] space-y-1">
                <p>POST /api/whatsapp/chat</p>
                <p>POST /api/whatsapp/review</p>
              </div>
            </Card>
          </div>

          {/* RIGHT: REALISTIC WHATSAPP CHAT INTERFACE (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="bg-[#efeae2] rounded-3xl overflow-hidden shadow-xl border border-slate-300 flex flex-col h-[40rem]">
              {/* WhatsApp Header */}
              <div className="bg-[#075e54] text-white px-4 py-3 flex items-center justify-between shadow">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-sm shadow">
                    🎓
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-sm leading-none">Nexora AI Study Bot</h3>
                      <span className="text-[10px] bg-emerald-400 text-slate-900 px-1 rounded-full font-bold">
                        ✓
                      </span>
                    </div>
                    <p className="text-[10px] text-emerald-200 mt-0.5">
                      online • Doubt Solver & Assignment Reviewer
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <Badge className="bg-emerald-800 text-emerald-100 border-none text-[10px]">
                    Gemini 3 Flash
                  </Badge>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                {messages.map((m) => {
                  const isUser = m.sender === "user";
                  return (
                    <div
                      key={m.id}
                      className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm text-xs space-y-1.5 ${
                          isUser
                            ? "bg-[#dcf8c6] text-slate-800 rounded-tr-none"
                            : "bg-white text-slate-800 rounded-tl-none border border-slate-100"
                        }`}
                      >
                        {/* Score pill if assignment review */}
                        {m.score !== undefined && (
                          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                            <span className="font-bold text-emerald-700">
                              ⭐ Score: {m.score}/10
                            </span>
                            <Badge variant={m.score >= 8 ? "success" : "warning"} className="text-[10px]">
                              {m.verdict}
                            </Badge>
                          </div>
                        )}

                        <div className="whitespace-pre-line leading-relaxed font-sans text-xs">
                          {m.text}
                        </div>

                        <div className="flex justify-end items-center gap-1 text-[9px] text-slate-400 pt-0.5">
                          <span>{m.time}</span>
                          {isUser && <span className="text-sky-500 font-bold">✓✓</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {(submittingDoubt || submittingAssignment) && (
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm border border-slate-100 text-xs text-slate-500 flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce" />
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce delay-100" />
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce delay-200" />
                      </div>
                      <span>
                        {submittingDoubt ? "AI is analyzing doubt..." : "AI is reviewing assignment steps..."}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <div className="bg-[#f0f2f5] p-3 border-t border-slate-200 flex items-center gap-2">
                <input
                  type="text"
                  value={doubtText}
                  onChange={(e) => setDoubtText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendDoubt(e as any);
                    }
                  }}
                  placeholder="Type a message or doubt on WhatsApp..."
                  className="flex-1 bg-white text-xs border border-slate-200 rounded-full px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleSendDoubt}
                  disabled={!doubtText.trim() || submittingDoubt}
                  className="h-9 w-9 rounded-full bg-[#00a884] hover:bg-[#075e54] text-white flex items-center justify-center disabled:opacity-50 transition-colors shadow"
                >
                  ➤
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

