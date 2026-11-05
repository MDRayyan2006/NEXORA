"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOutUser } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Avatar } from "@/components/ui";
import { SUPPORTED_LANGUAGES, LanguageCode } from "@/lib/i18n";

const NAV_ITEMS = [
  { href: "/dashboard", icon: "🏠", label: "Skills Dashboard", badge: "Overview" },
  { href: "/skills", icon: "🕸️", label: "Knowledge Graph & XP", badge: "Skills" },
  { href: "/focus", icon: "🧘", label: "Focus Mode & Shield", badge: "Lockdown" },
  { href: "/call-tutor", icon: "📞", label: "AI Phone Call Tutor", badge: "Live" },
  { href: "/whatsapp", icon: "💬", label: "WhatsApp Assistant", badge: "24/7" },
  { href: "/learn", icon: "📚", label: "Videos & Textbooks", badge: "Materials" },
  { href: "/resume", icon: "📄", label: "AI Resume & Forms", badge: "Auto-Fill" },
  { href: "/settings", icon: "⚙️", label: "Settings & Profile", badge: "" },
];

interface SidebarProps {
  user: { email?: string; display_name?: string; avatar_url?: string } | null;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ user, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const [currentLang, setCurrentLang] = useState<LanguageCode>("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("nexora_lang") as LanguageCode;
      if (stored) setCurrentLang(stored);
    }
  }, []);

  const handleLanguageChange = (lang: LanguageCode) => {
    setCurrentLang(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("nexora_lang", lang);
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOutUser();
    router.push("/");
    router.refresh();
  };

  const displayName = user?.display_name ?? user?.email?.split("@")[0] ?? "Learner";

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-100 z-40",
          "flex flex-col transition-transform duration-300 ease-in-out",
          "lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="p-5 border-b border-slate-100">
          <Link href="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-teal-400 to-[#152d4a] flex items-center justify-center shadow-sm">
              <span className="text-white font-extrabold text-base">N</span>
            </div>
            <div>
              <span className="font-extrabold text-[#152d4a] text-lg tracking-tight leading-none">NEXORA</span>
              <p className="text-[10px] text-teal-700 font-semibold leading-none mt-0.5">Voice & WhatsApp AI</p>
            </div>
          </Link>
        </div>

        {/* Language Quick Switcher */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500">Language:</span>
          <select
            value={currentLang}
            onChange={(e) => handleLanguageChange(e.target.value as LanguageCode)}
            className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none text-slate-700 font-medium"
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.flag} {l.name}
              </option>
            ))}
          </select>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Channels & Services
          </p>
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150",
                      active
                        ? "bg-teal-50 text-teal-800 font-bold shadow-sm"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={cn(
                          "text-[9px] px-1.5 py-0.5 rounded-md font-bold",
                          active
                            ? "bg-teal-600 text-white"
                            : "bg-slate-100 text-slate-500"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User area */}
        <div className="p-4 border-t border-slate-100 space-y-2 bg-slate-50/50">
          <Link
            href="/settings"
            onClick={onClose}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-white transition-colors"
          >
            <Avatar name={displayName} src={user?.avatar_url} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{displayName}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email || "student@nexora.edu"}</p>
            </div>
            <span className="text-slate-400 text-xs">⚙️</span>
          </Link>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="w-full text-left flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
          >
            <span>🚪</span> {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </aside>
    </>
  );
}
