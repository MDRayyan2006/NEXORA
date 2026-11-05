# NEXORA — AI-Powered Learning Intelligence & Human Capability Discovery

**Tagline:** Discover Potential. Transform Learning. Unlock Opportunity.

---

## 🚀 Overview

**NEXORA** connects learning to opportunity through an integrated intelligence loop:

1. **Learning Failure Archaeologist**: Traces learning struggles back through concept prerequisite graphs to diagnose root-cause misconceptions.
2. **Human Capability Compiler**: Converts observable problem-solving activities into structured, machine-verifiable capability portfolios.
3. **Cross-Domain Skill Transfer Explorer**: Identifies structural bridges between disparate domains (e.g., chess planning to project management) and validates them with bridge missions.
4. **Gemma Multilingual AI Companion**: Native support for **English and Telugu (తెలుగు)** with technical concept simplification.
5. **Skill-to-Career & Opportunity Matching**: Transparent, weighted capability matching connecting demonstrated evidence to internships and career trajectories.
6. **Focus Mode Workspace**: Distraction-minimised Pomodoro study sprints.
7. **Growth Analytics & Opt-In Leaderboard**: Measures relative improvement over time, not absolute marks.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS + Custom Brand Tokens (Deep Navy, Warm Teal, Amber)
- **Knowledge Graphs**: React Flow (`reactflow` / `@xyflow/react`) for Concept & Transfer networks
- **Visualizations**: Recharts for Growth curves, Bar charts, and Capability Radars
- **Data Layer**: **Firebase** (Firebase Auth + Cloud Firestore + Firebase Storage)
- **State & Data Fetching**: TanStack React Query v5
- **AI Tutoring**: Google Gemma (configurable via Groq / Ollama / Together / Demo mode)
- **Mastery Modeling**: Bayesian Knowledge Tracing (BKT)

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
cd nexora
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your settings:

```env
# ── FIREBASE CONFIGURATION ──
# Get these from https://console.firebase.google.com -> Project Settings -> General -> Your apps (Web)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# ── AI PROVIDER (Gemma) ──
# Options: "demo" | "groq" | "ollama" | "together"
# "demo"   -> Uses pre-calibrated sample explanations (no API key needed!)
# "groq"   -> Free high-speed Gemma 2 9B inference (get key at https://console.groq.com)
# "ollama" -> Runs locally via `ollama run gemma2:2b`
GEMMA_PROVIDER=demo

# Groq API Key (if GEMMA_PROVIDER=groq)
GROQ_API_KEY=your_groq_api_key_here

# Ollama Settings (if GEMMA_PROVIDER=ollama)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=gemma2:2b

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Note on Demo Mode:** Out of the box, `GEMMA_PROVIDER=demo` and fallback Firebase credentials are active. All pages, diagnostics, quizzes, skill graphs, career recommendations, and missions are 100% interactive without needing any external API keys!

### 3. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```
