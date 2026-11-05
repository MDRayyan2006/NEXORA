import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ── NAV ───────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#152d4a] flex items-center justify-center shadow-sm">
              <span className="text-white font-extrabold text-base">N</span>
            </div>
            <div>
              <span className="font-extrabold text-[#152d4a] text-lg tracking-tight leading-none block">NEXORA</span>
              <span className="text-[10px] text-teal-700 font-bold block">Voice & WhatsApp AI</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#how-it-works" className="hover:text-[#14b8a6] transition-colors">How It Works</a>
            <a href="#channels" className="hover:text-[#14b8a6] transition-colors">Keypad vs Web</a>
            <a href="#resume" className="hover:text-[#14b8a6] transition-colors">Auto-Resume & Jobs</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="text-xs font-semibold text-slate-600 hover:text-[#152d4a] transition-colors hidden sm:block">
              Sign In
            </Link>
            <Link href="/sign-up" className="text-xs font-bold bg-[#152d4a] text-white px-4 py-2.5 rounded-xl hover:bg-[#0f2037] transition-all active:scale-95 shadow">
              Register Student Free →
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="pt-32 pb-24 px-5" style={{ background: "linear-gradient(135deg, #091525 0%, #152d4a 60%, #0d9488 100%)" }}>
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-teal-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-white/10">
            🚀 Universal AI Learning: Keypad Phone Calls + WhatsApp + Auto Resume
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight tracking-tight">
            Education for Every Student.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2dd4bf] to-[#fbbf24]">
              Even on Basic Keypad Phones.
            </span>
          </h1>
          <p className="mt-6 text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Register your number. Our AI automatically calls your phone at your scheduled daily time, teaches the lesson conversationally in your native language, and tests you via keypad buttons (1, 2, 3, 4). As you master topics, it auto-generates your job resume and fills application forms.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up" className="bg-[#14b8a6] text-white font-bold px-8 py-4 rounded-2xl text-sm md:text-base hover:bg-[#0d9488] transition-all active:scale-95 shadow-xl">
              Register Phone & Schedule Call →
            </Link>
            <Link href="/dashboard" className="border border-white/30 text-white font-semibold px-8 py-4 rounded-2xl text-sm md:text-base hover:bg-white/10 transition-all active:scale-95">
              Explore Skills Dashboard
            </Link>
          </div>
          <p className="mt-5 text-xs text-slate-400">
            Zero 4G data or smartphone required for phone calls · English, Telugu, Hindi & Tamil Audio
          </p>
        </div>

        {/* 2 Core User Modes: Keypad Phone vs Web Student */}
        <div id="channels" className="max-w-4xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/10 border border-white/20 backdrop-blur rounded-3xl p-6 text-left text-white space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-3xl">📱</span>
              <span className="text-xs bg-amber-400 text-slate-900 font-bold px-3 py-1 rounded-full">
                For Keypad Phone Users
              </span>
            </div>
            <h3 className="text-xl font-bold">Daily Automated AI Calls</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              At your scheduled time every day, our AI dials your phone, explains the topic step-by-step, and conducts an oral test using your phone's keypad digits (1, 2, 3, 4). No smartphone or internet needed.
            </p>
          </div>

          <div className="bg-white/10 border border-white/20 backdrop-blur rounded-3xl p-6 text-left text-white space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-3xl">💻</span>
              <span className="text-xs bg-teal-400 text-slate-900 font-bold px-3 py-1 rounded-full">
                For Website Students
              </span>
            </div>
            <h3 className="text-xl font-bold">Skills Dashboard & Video Hub</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Visual skills matrix tracking verified mastery, curated video lectures, textbook notes, and 24/7 WhatsApp AI homework assistance with rubric scoring.
            </p>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-5 bg-slate-50">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <div>
            <h2 className="text-3xl font-extrabold text-[#152d4a]">How NEXORA Operates</h2>
            <p className="text-sm text-slate-500 mt-2 max-w-xl mx-auto">
              A comprehensive multi-channel learning pipeline designed for equity and real-world employment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <span className="text-2xl">⏰</span>
              <h3 className="font-bold text-slate-900 text-sm">1. Register Schedule</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Enter your mobile number and preferred time. Pick your topic and audio language (English, Telugu, Hindi, Tamil).
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <span className="text-2xl">📞</span>
              <h3 className="font-bold text-slate-900 text-sm">2. AI Voice Lesson</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                The AI calls your phone, teaches the concept with everyday analogies, and asks 2 keypad test questions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <span className="text-2xl">💬</span>
              <h3 className="font-bold text-slate-900 text-sm">3. WhatsApp Doubts</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Snap a photo or type difficult homework steps on WhatsApp. Gemini AI gives hints without spoiling answers.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <span className="text-2xl">📄</span>
              <h3 className="font-bold text-slate-900 text-sm">4. Auto Job Forms</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                As skills are validated, our AI automatically creates an ATS-ready resume and auto-fills job application forms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── AUTO-RESUME FEATURE SPOTLIGHT ──────────────────────────── */}
      <section id="resume" className="py-20 px-5 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full">
              Automated Employment Pipeline
            </span>
            <h2 className="text-3xl font-extrabold text-[#152d4a] leading-tight">
              From Phone Call Lessons Directly to Job Applications
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Because our AI tutor knows exactly which skills you were trained on and your verified keypad test scores, it continuously updates a verified digital resume for you.
            </p>
            <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
              <li>Verified badges for mental math, billing, electrical circuits, and spoken English</li>
              <li>Auto-filled application forms for Apprenticeships (NATS / PMKVY), Retail Billing, and Tech Support</li>
              <li>One-click printable and ATS-optimized PDF export</li>
            </ul>
            <div className="pt-2">
              <Link href="/sign-up">
                <button className="bg-[#152d4a] text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-[#0f2037] transition-all">
                  Get Started Free →
                </button>
              </Link>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-2xl border-4 border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-teal-400 font-bold">NEXORA RESUME ENGINE</span>
              <span className="text-[10px] text-emerald-400">✓ AI VERIFIED</span>
            </div>
            <p className="text-slate-300 font-sans font-bold text-sm">Ravi Kumar</p>
            <p className="text-slate-400 text-[11px] font-sans">Certified Technical Apprentice & Billing Specialist</p>
            <div className="bg-slate-800/80 p-3 rounded-xl space-y-1 text-[11px]">
              <p className="text-teal-300 font-bold font-sans">Verified Keypad Competencies:</p>
              <p>• Commercial Percentages & Billing (100% DTMF Score)</p>
              <p>• Ohm's Law & Circuit Diagnostics (Passed)</p>
              <p>• Spoken English & Corporate Phone Etiquette</p>
            </div>
            <div className="bg-emerald-950/60 border border-emerald-800 p-2.5 rounded-xl text-[10px] text-emerald-300">
              ✓ Ready for 1-Click Submission to National Apprenticeship Portals
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <footer className="py-12 px-5 bg-slate-900 text-white text-center text-xs space-y-3">
        <p className="font-bold text-sm text-teal-400">NEXORA — AI-Powered Universal Learning</p>
        <p className="text-slate-400">
          Built for GDG Hackathon. Bridging the digital divide for students on keypad phones and smartphones alike.
        </p>
        <p className="text-slate-500 text-[10px]">
          © 2026 Nexora Education. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
