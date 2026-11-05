"use client";

/**
 * Sign In Page — /sign-in
 * Powered by Firebase Auth
 */

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmail } from "@/lib/firebase/auth";
import { cn } from "@/lib/utils";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      const { user, error: authError } = await signInWithEmail(email.trim().toLowerCase(), password);

      if (authError) {
        setError(authError);
        return;
      }

      // Successful sign-in — redirect to dashboard
      router.push("/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16 bg-slate-50">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Gradient header */}
          <div className="bg-gradient-to-br from-[#152d4a] via-[#1e3a5f] to-[#14b8a6] px-8 py-10 text-center">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-white/10 backdrop-blur mb-4 shadow">
              <span className="text-white font-extrabold text-2xl">N</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Welcome back
            </h1>
            <p className="text-teal-100 text-sm mt-1">
              Sign in with Firebase to continue your learning journey
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="px-8 py-8 space-y-5">
            {/* Error banner */}
            {error && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                <span className="mt-0.5 flex-shrink-0">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-700"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={cn(
                  "w-full px-4 py-3 rounded-xl border text-sm text-slate-800 placeholder:text-slate-400",
                  "bg-slate-50 focus:bg-white transition-colors",
                  "outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-[#14b8a6]",
                  error ? "border-red-300" : "border-slate-200"
                )}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>
                <span className="text-xs text-slate-400 cursor-default select-none">
                  Forgot password?
                </span>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={cn(
                  "w-full px-4 py-3 rounded-xl border text-sm text-slate-800 placeholder:text-slate-400",
                  "bg-slate-50 focus:bg-white transition-colors",
                  "outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-[#14b8a6]",
                  error ? "border-red-300" : "border-slate-200"
                )}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full py-3 rounded-xl text-sm font-bold text-white transition-all duration-150",
                "bg-gradient-to-r from-[#152d4a] to-[#14b8a6] hover:opacity-90 active:scale-[0.98]",
                "flex items-center justify-center gap-2 shadow-sm",
                "disabled:opacity-60 disabled:pointer-events-none"
              )}
            >
              {loading ? "Signing in with Firebase…" : "Sign In"}
            </button>

            {/* Instant Demo Access Button */}
            <button
              type="button"
              onClick={handleDemoSignIn}
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              ⚡ Explore Instantly in Demo Mode (No login required)
            </button>

            {/* Sign-up link */}
            <p className="text-center text-sm text-slate-500 pt-1">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="font-semibold text-[#14b8a6] hover:text-[#0d9488] transition-colors"
              >
                Create one free
              </Link>
            </p>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-400 mt-6">
          By signing in, you agree to NEXORA&apos;s Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
