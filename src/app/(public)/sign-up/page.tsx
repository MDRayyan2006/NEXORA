"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUpWithEmail } from "@/lib/firebase/auth";
import { cn } from "@/lib/utils";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) { setError("Please enter your name."); return; }
    if (!email.trim()) { setError("Please enter your email."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setLoading(true);
    try {
      const { user, error: authError } = await signUpWithEmail(
        email.trim().toLowerCase(),
        password,
        name.trim()
      );

      if (authError) {
        setError(authError);
        return;
      }

      // Store display name temporarily for onboarding
      if (typeof window !== "undefined") {
        localStorage.setItem("nexora_user_name", name.trim());
      }

      // Route new learners to the interactive onboarding & baseline test
      router.push("/onboarding");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleInstantDemo = () => {
    router.push("/onboarding");
    router.refresh();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16 bg-slate-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-br from-[#152d4a] via-[#1e3a5f] to-[#14b8a6] px-8 py-10 text-center">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-white/10 backdrop-blur mb-4 shadow">
              <span className="text-white font-extrabold text-2xl">N</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Join NEXORA</h1>
            <p className="text-teal-100 text-sm mt-1">
              Create your account to take your baseline capability test
            </p>
          </div>
          <form onSubmit={handleSubmit} noValidate className="px-8 py-8 space-y-5">
            {error && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                <span className="mt-0.5 shrink-0">⚠️</span>
                <div>
                  <span className="block font-medium">{error}</span>
                </div>
              </div>
            )}
            {[
              { id: "name", label: "Your name", type: "text", value: name, set: setName, placeholder: "Alex Johnson", auto: "name" },
              { id: "email", label: "Email address", type: "email", value: email, set: setEmail, placeholder: "you@example.com", auto: "email" },
              { id: "password", label: "Password", type: "password", value: password, set: setPassword, placeholder: "Min. 6 characters", auto: "new-password" },
            ].map((f) => (
              <div key={f.id} className="space-y-1.5">
                <label htmlFor={f.id} className="block text-sm font-semibold text-slate-700">{f.label}</label>
                <input
                  id={f.id} type={f.type} autoComplete={f.auto} required
                  value={f.value} onChange={(e) => f.set(e.target.value)} placeholder={f.placeholder}
                  className={cn("w-full px-4 py-3 rounded-xl border text-sm text-slate-800 placeholder:text-slate-400 bg-slate-50 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-[#14b8a6]", error ? "border-red-300" : "border-slate-200")}
                />
              </div>
            ))}
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#152d4a] to-[#14b8a6] hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 disabled:pointer-events-none transition-all">
              {loading ? "Creating Account…" : "Create Account & Start Diagnostic →"}
            </button>

            {/* Instant Access Button */}
            <button
              type="button"
              onClick={handleInstantDemo}
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              ⚡ Take Baseline Test Without Account (Guest)
            </button>

            <p className="text-center text-sm text-slate-500 pt-1">
              Already have an account?{" "}
              <Link href="/sign-in" className="font-semibold text-[#14b8a6] hover:text-[#0d9488] transition-colors">Sign in</Link>
            </p>
          </form>
        </div>
        <p className="text-center text-xs text-slate-400 mt-4">
          By signing up, you agree to NEXORA&apos;s Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
