"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge } from "@/components/ui";
import { REAL_CURRICULUM } from "@/lib/data/curriculum";

interface Question {
  questionNumber: number;
  questionText: string;
  options: { digit: number; text: string }[];
  correctDigit: number;
  explanation: string;
}

interface VoiceSession {
  sessionId: string;
  topic: string;
  language: string;
  introScript: string;
  teachingScript: string[];
  testIntroScript: string;
  questions: Question[];
  conclusionScript: string;
}

export default function CallTutorPage() {
  // Schedule Form State
  const [phoneNumber, setPhoneNumber] = useState("+91 98765 43210");
  const [preferredTime, setPreferredTime] = useState("18:30");
  const [selectedTopic, setSelectedTopic] = useState("Percentages & Ratios");
  const [language, setLanguage] = useState("en");
  const [savingSchedule, setSavingSchedule] = useState(false);
  const [scheduleSaved, setScheduleSaved] = useState(false);

  // Outbound Real Call State (Credentials strictly hidden in backend)
  const [placingRealCall, setPlacingRealCall] = useState(false);
  const [realCallMsg, setRealCallMsg] = useState<{ success: boolean; text: string } | null>(null);
  const [autoDialerActive, setAutoDialerActive] = useState(false);
  const [skillUnlockedMsg, setSkillUnlockedMsg] = useState<{ topic: string; score: number; total: number } | null>(null);

  // In-Browser Audio Call Simulation State
  const [callState, setCallState] = useState<"idle" | "incoming" | "connected" | "ended">("idle");
  const [callDuration, setCallDuration] = useState(0);
  const [currentSession, setCurrentSession] = useState<VoiceSession | null>(null);
  const [currentStage, setCurrentStage] = useState<"intro" | "teaching" | "testIntro" | "question1" | "question2" | "conclusion">("intro");
  const [teachingIdx, setTeachingIdx] = useState(0);
  const [transcript, setTranscript] = useState<{ speaker: "AI Tutor" | "Student (Keypad)"; text: string; time: string }[]>([]);
  const [studentScore, setStudentScore] = useState<{ q1?: boolean; q2?: boolean }>({});
  const [generatingCall, setGeneratingCall] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load schedule on mount
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/calls/schedule");
        const data = await res.json();
        if (data.schedule) {
          setPhoneNumber(data.schedule.phoneNumber || "+91 8328004967");
          setPreferredTime(data.schedule.preferredTime || "18:30");
          setSelectedTopic(data.schedule.topic || "Percentages & Ratios");
          setLanguage(data.schedule.language || "en");
          setAutoDialerActive(Boolean(data.autoDialerActive));
        }
      } catch {}
    }
    loadData();
  }, []);

  // Save Schedule Handler
  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSchedule(true);
    try {
      const res = await fetch("/api/calls/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber,
          preferredTime,
          topic: selectedTopic,
          language,
          enabled: true,
        }),
      });
      const data = await res.json();
      setScheduleSaved(true);
      setAutoDialerActive(true);
      setRealCallMsg({
        success: true,
        text: `✅ Daily AI Auto-Dialer Active! Nexora will call ${phoneNumber} every day at ${preferredTime} for "${selectedTopic}". You can also click "⚡ Dial Scheduled Call Now" to test immediately.`,
      });
      setTimeout(() => setScheduleSaved(false), 4000);
    } catch {}
    setSavingSchedule(false);
  };

  // Trigger Scheduled Call Now
  const handleTriggerScheduledNow = async () => {
    setPlacingRealCall(true);
    setRealCallMsg(null);
    try {
      const res = await fetch("/api/calls/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          triggerNow: true,
          phoneNumber,
          topic: selectedTopic,
          language,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRealCallMsg({
          success: true,
          text: `📞 Scheduled AI call placed to ${phoneNumber}! Answer your phone to begin your lesson and test.`,
        });
      } else {
        setRealCallMsg({
          success: false,
          text: data.message || "Failed to trigger scheduled call.",
        });
      }
    } catch (err: any) {
      setRealCallMsg({
        success: false,
        text: "Could not trigger scheduled call.",
      });
    } finally {
      setPlacingRealCall(false);
    }
  };

  // Trigger Real Phone Call via Backend Twilio API (Zero frontend credentials)
  const handlePlaceRealCall = async () => {
    setPlacingRealCall(true);
    setRealCallMsg(null);
    try {
      const res = await fetch("/api/twilio/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber,
          topic: selectedTopic,
          language,
          studentName: "Student",
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRealCallMsg({
          success: true,
          text: `🎉 Calling ${phoneNumber} right now! Pick up your phone to experience the AI voice lesson and keypad oral test.`,
        });
      } else {
        setRealCallMsg({
          success: false,
          text: data.message || data.error || "Unable to place call at this moment. You can test immediately using the Audio Simulator below.",
        });
      }
    } catch (err: any) {
      setRealCallMsg({
        success: false,
        text: "Telephony gateway responding. If destination phone is unverified on Twilio Trial, use the in-browser Keypad Simulator.",
      });
    } finally {
      setPlacingRealCall(false);
    }
  };

  // Speak aloud via browser Web Speech API
  const speakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (language === "te") utterance.lang = "te-IN";
    else if (language === "hi") utterance.lang = "hi-IN";
    else if (language === "ta") utterance.lang = "ta-IN";
    else utterance.lang = "en-IN";
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  // Play DTMF tone sound using Web Audio API
  const playDTMFTone = (digit: string | number) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(697 + Number(digit || 1) * 50, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch {}
  };

  // Trigger Simulator Call
  const handleTriggerSimulatorCall = async () => {
    setGeneratingCall(true);
    try {
      const res = await fetch("/api/calls/generate-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: selectedTopic,
          language,
          studentName: "Student",
        }),
      });
      const data = await res.json();
      if (data.session) {
        setCurrentSession(data.session);
        setCallState("incoming");
        speakText("Incoming call from Nexora Daily AI Tutor");
      }
    } catch {
      alert("Failed to initialize call. Please check connection.");
    } finally {
      setGeneratingCall(false);
    }
  };

  // Answer Simulator Call
  const handleAnswerCall = () => {
    setCallState("connected");
    setCallDuration(0);
    setTranscript([]);
    setStudentScore({});
    setCurrentStage("intro");

    timerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    if (currentSession) {
      addTranscript("AI Tutor", currentSession.introScript);
      speakText(currentSession.introScript);

      setTimeout(() => {
        advanceToTeaching(0);
      }, 5000);
    }
  };

  const advanceToTeaching = (idx: number) => {
    if (!currentSession) return;
    setCurrentStage("teaching");
    setTeachingIdx(idx);
    const text = currentSession.teachingScript[idx];
    if (text) {
      addTranscript("AI Tutor", text);
      speakText(text);

      setTimeout(() => {
        if (idx + 1 < currentSession.teachingScript.length) {
          advanceToTeaching(idx + 1);
        } else {
          advanceToTest();
        }
      }, 6500);
    }
  };

  const advanceToTest = () => {
    if (!currentSession) return;
    setCurrentStage("testIntro");
    addTranscript("AI Tutor", currentSession.testIntroScript);
    speakText(currentSession.testIntroScript);

    setTimeout(() => {
      presentQuestion(1);
    }, 4500);
  };

  const presentQuestion = (qNum: 1 | 2) => {
    if (!currentSession) return;
    setCurrentStage(qNum === 1 ? "question1" : "question2");
    const q = currentSession.questions[qNum - 1];
    if (q) {
      const spokenText = `${q.questionText}. ` + q.options.map((o) => `Press ${o.digit} for ${o.text}`).join(". ");
      addTranscript("AI Tutor", `[Question ${qNum}]: ${spokenText}`);
      speakText(spokenText);
    }
  };

  const handleKeyPress = (digit: number) => {
    playDTMFTone(digit);
    if (callState !== "connected" || !currentSession) return;

    if (currentStage === "question1") {
      const q = currentSession.questions[0];
      const isCorrect = digit === q.correctDigit;
      setStudentScore((prev) => ({ ...prev, q1: isCorrect }));
      addTranscript("Student (Keypad)", `Pressed Key [ ${digit} ]`);

      const reply = isCorrect
        ? `Correct! Keypad digit ${digit} is correct. ${q.explanation}`
        : `Keypad digit ${digit} is incorrect. The correct answer was option ${q.correctDigit}. ${q.explanation}`;
      
      addTranscript("AI Tutor", reply);
      speakText(reply);

      setTimeout(() => {
        if (currentSession.questions.length > 1) {
          presentQuestion(2);
        } else {
          finishCall();
        }
      }, 5000);
    } else if (currentStage === "question2") {
      const q = currentSession.questions[1];
      const isCorrect = digit === q.correctDigit;
      setStudentScore((prev) => ({ ...prev, q2: isCorrect }));
      addTranscript("Student (Keypad)", `Pressed Key [ ${digit} ]`);

      const reply = isCorrect
        ? `Spot on! Option ${digit} is right. ${q.explanation}`
        : `Option ${digit} is not correct. The correct answer was option ${q.correctDigit}. ${q.explanation}`;

      addTranscript("AI Tutor", reply);
      speakText(reply);

      setTimeout(() => {
        finishCall();
      }, 5000);
    }
  };

  const finishCall = () => {
    if (!currentSession) return;
    setCurrentStage("conclusion");
    addTranscript("AI Tutor", currentSession.conclusionScript);
    speakText(currentSession.conclusionScript);

    // If passed MCQ test, record skill to verified profile & resume
    const score = (studentScore.q1 ? 1 : 0) + (studentScore.q2 ? 1 : 0);
    if (score >= 1) {
      fetch("/api/skills/qualify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: selectedTopic,
          score,
          total: 2,
          passed: true,
          method: "web_simulator",
        }),
      }).catch(() => {});
      setSkillUnlockedMsg({
        topic: selectedTopic,
        score,
        total: 2,
      });
    }

    setTimeout(() => {
      handleEndCall();
    }, 6000);
  };

  const handleEndCall = () => {
    setCallState("ended");
    if (timerRef.current) clearInterval(timerRef.current);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const addTranscript = (speaker: "AI Tutor" | "Student (Keypad)", text: string) => {
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setTranscript((prev) => [...prev, { speaker, text, time }]);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📞</span>
            <h1 className="text-2xl font-bold text-slate-900">
              AI Phone Call Tutor & Keypad Testing
            </h1>
            <Badge variant="success">
              ✓ Telephony Engine Active
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Empowering students with basic keypad phones. The AI dials the student's mobile number, delivers conversational audio lessons in their native language, and tests their comprehension using phone keypad digits (1, 2, 3, 4).
          </p>
        </div>

        {/* Skill Qualified Notification */}
        {skillUnlockedMsg && (
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎉</span>
              <div>
                <h4 className="text-sm font-bold text-emerald-900">
                  Skill Verified & Added to AI Resume: {skillUnlockedMsg.topic}!
                </h4>
                <p className="text-xs text-emerald-700 mt-0.5">
                  You scored {skillUnlockedMsg.score}/{skillUnlockedMsg.total} on today's MCQ test. AI has automatically updated your verified resume and auto-filled your internship applications!
                </p>
              </div>
            </div>
            <Link
              href="/resume"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow shrink-0 text-center"
            >
              🚀 View AI Resume & Apply for Internships →
            </Link>
          </div>
        )}

        {/* Real Outbound Call Status Notification */}
        {realCallMsg && (
          <div
            className={`p-4 rounded-2xl text-xs flex items-center gap-3 border ${
              realCallMsg.success
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-amber-50 border-amber-200 text-amber-900"
            }`}
          >
            <span className="text-xl">{realCallMsg.success ? "🔔" : "ℹ️"}</span>
            <span className="font-semibold">{realCallMsg.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: SCHEDULE CONFIGURATION & LIVE TRANSCRIPT (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Scheduling Form */}
            <Card className="p-6 space-y-5">
              <CardHeader className="p-0">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-base font-bold text-slate-900">
                      Daily Call Schedule & Student Registration
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      Register your mobile number. Our AI will automatically initiate the learning call every day at this time.
                    </CardDescription>
                  </div>
                  <Badge variant="info" className="text-[10px]">
                    Backend Protected
                  </Badge>
                </div>
              </CardHeader>

              {scheduleSaved && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                  <span>✓</span>
                  <span>Daily schedule updated! Daily automated calls are active for this phone number.</span>
                </div>
              )}

              <form onSubmit={handleSaveSchedule} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Student Mobile Number (Keypad or Smartphone)
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 98765 43210"
                      required
                      className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Preferred Daily Call Time
                    </label>
                    <input
                      type="time"
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      required
                      className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Current Learning Curriculum / Topic
                    </label>
                    <select
                      value={selectedTopic}
                      onChange={(e) => setSelectedTopic(e.target.value)}
                      className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      {REAL_CURRICULUM.map((c) => (
                        <option key={c.id} value={c.title}>
                          {c.title} ({c.gradeLevel})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Call Voice & Language
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="en">English (Aditi Voice)</option>
                      <option value="te">Telugu (తెలుగు వాయిస్ ట్యూటర్)</option>
                      <option value="hi">Hindi (हिंदी वॉइस ట్యూటర్)</option>
                      <option value="ta">Tamil (தமிழ் வாய்ஸ் டியூட்டர்)</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Button type="submit" variant="primary" size="sm" disabled={savingSchedule}>
                      {savingSchedule ? "Saving Schedule..." : "Save Daily Schedule"}
                    </Button>

                    {/* Quick Call Me Now button */}
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={handleTriggerScheduledNow}
                      disabled={placingRealCall}
                      className="bg-teal-700 hover:bg-teal-800 text-white font-bold"
                    >
                      {placingRealCall ? "Connecting..." : "⚡ Call Me Now via AI"}
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    {/* Simulator Button */}
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleTriggerSimulatorCall}
                      disabled={generatingCall || callState === "connected" || callState === "incoming"}
                      className="bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 font-semibold"
                    >
                      {generatingCall ? "Connecting..." : "🎮 Test on Audio Simulator"}
                    </Button>
                  </div>
                </div>
              </form>
            </Card>

            {/* How Keypad Tutoring Works Card */}
            <Card className="p-5 bg-gradient-to-br from-slate-900 to-[#152d4a] text-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-bold text-teal-400">
                  Feature Phone Architecture
                </span>
                <span className="text-xl">📱</span>
              </div>
              <h3 className="text-sm font-bold">
                How DTMF Keypad Testing Works on Basic Phones
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                When our AI calls the student's phone, it speaks the concept clearly in their chosen language. Then it reads multiple-choice questions aloud (e.g. <em>"Press 1 for 30, Press 2 for 40"</em>). When the student presses a number on their phone keypad, the Dual-Tone Multi-Frequency (DTMF) signal is captured instantly, graded by the AI, and spoken feedback is provided in real-time.
              </p>
              <div className="pt-1 flex gap-2 text-[10px]">
                <span className="bg-white/10 px-2.5 py-1 rounded-full">✓ No Internet Needed on Phone</span>
                <span className="bg-white/10 px-2.5 py-1 rounded-full">✓ Works on 2G Keypad Phones</span>
                <span className="bg-white/10 px-2.5 py-1 rounded-full">✓ Automatic Score Logging</span>
              </div>
            </Card>

            {/* Live Audio Call Transcript Stream */}
            <Card className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-slate-900">
                  Audio Call Dialogue Stream
                </CardTitle>
                {callState === "connected" && (
                  <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold animate-pulse">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Call Active ({formatSeconds(callDuration)})
                  </span>
                )}
              </div>

              <div className="h-52 overflow-y-auto bg-slate-900 text-slate-200 rounded-xl p-4 font-mono text-xs space-y-3">
                {transcript.length === 0 ? (
                  <p className="text-slate-500 italic text-center pt-20">
                    No active call transcript. Click "Dial Real Phone via AI" or "Audio Keypad Simulator".
                  </p>
                ) : (
                  transcript.map((t, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg ${
                        t.speaker === "AI Tutor" ? "bg-slate-800/80 text-teal-300" : "bg-emerald-950/70 text-emerald-200 ml-4"
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px] opacity-70 mb-1">
                        <span>{t.speaker}</span>
                        <span>{t.time}</span>
                      </div>
                      <p className="leading-relaxed">{t.text}</p>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* RIGHT: IN-BROWSER PHONE & KEYPAD SIMULATOR (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-sm bg-slate-900 rounded-[2.5rem] p-4 shadow-2xl border-4 border-slate-700 space-y-3">
              {/* Speaker Earpiece notch */}
              <div className="h-3 w-20 bg-slate-800 rounded-full mx-auto" />

              {/* Phone Screen Display */}
              <div className="bg-slate-950 rounded-2xl p-4 text-white min-h-[14rem] flex flex-col justify-between border border-slate-800">
                {/* Status Bar */}
                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span>NEXORA CELL</span>
                  <div className="flex items-center gap-1">
                    <span>VoLTE</span>
                    <span>🔋 92%</span>
                  </div>
                </div>

                {/* State: IDLE */}
                {callState === "idle" && (
                  <div className="text-center py-6 space-y-2">
                    <span className="text-3xl">📱</span>
                    <p className="text-xs font-semibold text-slate-300">Feature Phone Standby</p>
                    <p className="text-[10px] text-slate-500">
                      Scheduled Daily Call: {preferredTime}
                    </p>
                    <p className="text-[10px] text-teal-400">
                      Topic: {selectedTopic}
                    </p>
                  </div>
                )}

                {/* State: INCOMING CALL */}
                {callState === "incoming" && (
                  <div className="text-center py-4 space-y-3 animate-bounce">
                    <span className="text-3xl">🔔</span>
                    <div>
                      <p className="text-xs text-teal-400 font-bold uppercase tracking-wider">Incoming AI Call</p>
                      <h3 className="text-base font-extrabold text-white">Nexora AI Voice Tutor</h3>
                      <p className="text-[11px] text-slate-400 font-mono">{phoneNumber}</p>
                    </div>
                    <div className="flex justify-center gap-4 pt-2">
                      <button
                        onClick={handleAnswerCall}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-3 font-bold text-xs flex items-center gap-1 shadow-lg shadow-emerald-500/30"
                      >
                        📞 Answer Call
                      </button>
                      <button
                        onClick={handleEndCall}
                        className="bg-rose-500 hover:bg-rose-600 text-white rounded-full p-3 font-bold text-xs flex items-center gap-1"
                      >
                        ❌ Decline
                      </button>
                    </div>
                  </div>
                )}

                {/* State: CONNECTED CALL */}
                {callState === "connected" && (
                  <div className="text-center space-y-2 py-1">
                    <div className="flex items-center justify-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-xs text-emerald-400 font-mono font-bold">
                        {formatSeconds(callDuration)}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white">Nexora Voice Tutor</h4>
                    <p className="text-[10px] text-slate-400 truncate">{selectedTopic}</p>

                    {/* Audio wave animation */}
                    <div className="flex items-center justify-center gap-1 h-6 py-1">
                      {[40, 75, 50, 90, 60, 80, 45, 95, 30].map((h, i) => (
                        <div
                          key={i}
                          className="w-1 bg-teal-400 rounded-full animate-pulse"
                          style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}
                        />
                      ))}
                    </div>

                    {/* Stage status indicator */}
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-[10px]">
                      {currentStage === "intro" && "🎙️ Playing Lesson Introduction..."}
                      {currentStage === "teaching" && `📚 Teaching Concept (${teachingIdx + 1}/2)...`}
                      {currentStage === "testIntro" && "🔢 Preparing Keypad Test..."}
                      {currentStage === "question1" && "❓ Question 1: Press 1, 2, 3, or 4"}
                      {currentStage === "question2" && "❓ Question 2: Press 1, 2, 3, or 4"}
                      {currentStage === "conclusion" && "🌟 Lesson Complete!"}
                    </div>

                    <button
                      onClick={handleEndCall}
                      className="bg-rose-600 hover:bg-rose-700 text-white text-xs px-4 py-1.5 rounded-full font-bold shadow transition-colors"
                    >
                      End Call 📵
                    </button>
                  </div>
                )}

                {/* State: ENDED */}
                {callState === "ended" && (
                  <div className="text-center py-4 space-y-2">
                    <span className="text-2xl">✅</span>
                    <h4 className="text-sm font-bold text-white">Call Finished</h4>
                    <p className="text-xs text-slate-400">Duration: {formatSeconds(callDuration)}</p>
                    <div className="bg-slate-900 p-2 rounded-lg text-xs space-y-1">
                      <p className="text-slate-300">Keypad Test Results:</p>
                      <p className="font-bold text-teal-400">
                        Q1: {studentScore.q1 ? "✓ Correct" : "✗ Incorrect"} | Q2: {studentScore.q2 ? "✓ Correct" : "✗ Incorrect"}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => setCallState("idle")}
                      className="text-xs"
                    >
                      Ready for Next Call
                    </Button>
                  </div>
                )}
              </div>

              {/* 3x4 KEYPAD (DIALPAD) */}
              <div className="bg-slate-800 rounded-2xl p-3 space-y-2">
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Interactive Phone Keypad (DTMF)
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 1, sub: "" },
                    { key: 2, sub: "ABC" },
                    { key: 3, sub: "DEF" },
                    { key: 4, sub: "GHI" },
                    { key: 5, sub: "JKL" },
                    { key: 6, sub: "MNO" },
                    { key: 7, sub: "PQRS" },
                    { key: 8, sub: "TUV" },
                    { key: 9, sub: "WXYZ" },
                    { key: "*", sub: "" },
                    { key: 0, sub: "+" },
                    { key: "#", sub: "" },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => handleKeyPress(typeof item.key === "number" ? item.key : 0)}
                      className="h-12 bg-slate-700 hover:bg-slate-600 active:bg-teal-600 rounded-xl flex flex-col items-center justify-center text-white transition-all transform active:scale-95 shadow-inner"
                    >
                      <span className="text-base font-bold leading-none">{item.key}</span>
                      {item.sub && <span className="text-[8px] text-slate-400 leading-none mt-0.5">{item.sub}</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
