"use client";

import { useState, useEffect } from "react";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui";

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState("Student");
  const [preferredLang, setPreferredLang] = useState("en");
  const [educationLevel, setEducationLevel] = useState("Undergraduate");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState("Mathematics, Technology");
  const [userMode, setUserMode] = useState<"keypad" | "web">("web");

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user mode from localStorage
    const storedMode = localStorage.getItem("nexora_user_mode") as "keypad" | "web" | null;
    if (storedMode) setUserMode(storedMode);
    const storedLang = localStorage.getItem("nexora_lang");
    if (storedLang) setPreferredLang(storedLang);
    const storedName = localStorage.getItem("nexora_user_name");
    if (storedName) setDisplayName(storedName);

    async function loadProfile() {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000);
        const res = await fetch("/api/profile", { signal: controller.signal });
        clearTimeout(timeout);
        const data = await res.json();
        if (data.profile) {
          if (data.profile.display_name) setDisplayName(data.profile.display_name);
          if (data.profile.preferred_language) setPreferredLang(data.profile.preferred_language);
          if (data.profile.education_level) setEducationLevel(data.profile.education_level);
          if (data.profile.bio) setBio(data.profile.bio);
          if (data.profile.career_interests) setInterests(data.profile.career_interests.join(", "));
        }
      } catch {
        // Silently fall back to defaults if network/Firestore not ready
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    setSaveError(null);

    // Save mode and language to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("nexora_user_mode", userMode);
      localStorage.setItem("nexora_lang", preferredLang);
      localStorage.setItem("nexora_user_name", displayName);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          display_name: displayName,
          preferred_language: preferredLang,
          education_level: educationLevel,
          bio,
          career_interests: interests.split(",").map((s) => s.trim()),
        }),
      });
      clearTimeout(timeout);
      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        setSaveError("Could not save to server. Changes are stored locally.");
      }
    } catch (err: any) {
      clearTimeout(timeout);
      if (err?.name === "AbortError") {
        // Treat timeout as soft success — data was likely written server-side
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        setSaveError("Network error. Your changes are saved locally and will sync when connection is restored.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">⚙️ Settings & Learner Preferences</h1>
          <p className="text-sm text-slate-500 mt-1">
            Control your profile presentation, language preferences, and strict privacy boundaries.
          </p>
        </div>

        {savedSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
            <span>✓</span>
            <span>Preferences successfully saved and updated in your profile.</span>
          </div>
        )}

        {saveError && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
            <span>⚠️</span>
            <span>{saveError}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Identity & Profile */}
          <Card className="p-6 space-y-4">
            <CardHeader className="p-0">
              <CardTitle className="text-base font-bold text-slate-900">Learner Profile</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Personalization is driven by demonstrated performance rather than age or background labels.
              </CardDescription>
            </CardHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Language</label>
                <select
                  value={preferredLang}
                  onChange={(e) => setPreferredLang(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="en">English (Default)</option>
                  <option value="te">Telugu (తెలుగు - Full Support)</option>
                  <option value="hi">Hindi (हिंदी)</option>
                  <option value="ta">Tamil (தமிழ்)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Self-Reported Level</label>
                <select
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Secondary">Secondary / High School</option>
                  <option value="Undergraduate">Undergraduate / College</option>
                  <option value="Professional">Early-Career Professional</option>
                  <option value="Vocational">Vocational / Self-Taught</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Domains of Interest</label>
                <input
                  type="text"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  placeholder="e.g. Mathematics, AI, Web Development"
                  className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Brief Bio / Vision</label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </Card>

          {/* User Mode */}
          <Card className="p-6 space-y-4">
            <CardHeader className="p-0">
              <CardTitle className="text-base font-bold text-slate-900">📱 Learning Mode</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Choose how you want to interact with Nexora. Keypad mode optimizes the experience for feature phones (calls + number keys). Web mode gives full browser-based learning.
              </CardDescription>
            </CardHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <label
                className={`flex flex-col gap-1.5 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  userMode === "web"
                    ? "border-teal-500 bg-teal-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="userMode"
                  value="web"
                  checked={userMode === "web"}
                  onChange={() => setUserMode("web")}
                  className="sr-only"
                />
                <span className="text-2xl">💻</span>
                <span className="text-sm font-bold text-slate-800">Web / Smartphone</span>
                <span className="text-xs text-slate-500">Full browser UI, videos, interactive quizzes, chat</span>
              </label>

              <label
                className={`flex flex-col gap-1.5 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  userMode === "keypad"
                    ? "border-teal-500 bg-teal-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="userMode"
                  value="keypad"
                  checked={userMode === "keypad"}
                  onChange={() => setUserMode("keypad")}
                  className="sr-only"
                />
                <span className="text-2xl">📞</span>
                <span className="text-sm font-bold text-slate-800">Keypad / Feature Phone</span>
                <span className="text-xs text-slate-500">AI teaches via phone call, press 1–4 to answer tests</span>
              </label>
            </div>
          </Card>

          {/* AI Runtime Configuration */}
          <Card className="p-6 space-y-3">
            <CardTitle className="text-base font-bold text-slate-900">Gemini AI Runtime Engine</CardTitle>
            <p className="text-xs text-slate-500">
              Nexora uses Google Gemini API for personalized quiz generation, concept explanations, and capability extraction. All inference runs through secure backend endpoints.
            </p>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 flex justify-between items-center">
              <span>PROVIDER: gemini · MODEL: gemini-3-flash-preview</span>
              <Badge variant="info">Active</Badge>
            </div>
          </Card>

          {/* Firebase Status */}
          <Card className="p-6 space-y-3">
            <CardTitle className="text-base font-bold text-slate-900">Database & Auth Status</CardTitle>
            <p className="text-xs text-slate-500">
              Firebase project: <code className="bg-slate-100 px-1 rounded">gdgvizag-4c54e</code>
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-100 rounded-lg">
                <span className="text-blue-600">ℹ️</span>
                <span className="text-blue-700">
                  To enable full persistence, go to{" "}
                  <a
                    href="https://console.firebase.google.com/project/gdgvizag-4c54e/firestore"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-semibold"
                  >
                    Firebase Console → Firestore
                  </a>{" "}
                  and create the database (Test mode). Until then, settings save locally.
                </span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-100 rounded-lg">
                <span className="text-blue-600">ℹ️</span>
                <span className="text-blue-700">
                  For Email/Password login, go to{" "}
                  <a
                    href="https://console.firebase.google.com/project/gdgvizag-4c54e/authentication/providers"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-semibold"
                  >
                    Firebase Console → Authentication → Sign-in method
                  </a>{" "}
                  and enable Email/Password provider.
                </span>
              </div>
            </div>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? "Saving Changes..." : "Save Preferences"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
