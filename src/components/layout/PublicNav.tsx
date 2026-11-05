"use client";

/**
 * PublicNav — Responsive Navigation Bar for Public Pages
 *
 * Features:
 *  - NEXORA logo with gradient icon
 *  - Desktop nav links: Home, About, How It Works, Features
 *  - Sign In (outline) + Sign Up (primary) CTA buttons
 *  - Mobile hamburger menu with animated slide-down panel
 *  - Smooth scroll to anchor sections when on the landing page
 */

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Features", href: "/#features" },
];

export function PublicNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-teal-400 to-[#152d4a] flex items-center justify-center shadow-sm">
              <span className="text-white font-extrabold text-sm">N</span>
            </div>
            <div className="leading-none">
              <span className="font-extrabold text-[#0f2037] text-lg tracking-tight">
                NEXORA
              </span>
              <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                Learning Intelligence
              </p>
            </div>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-[#0f2037] hover:bg-slate-50 rounded-lg transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ── Desktop CTA Buttons ── */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/sign-in"
              className="px-4 py-2 text-sm font-semibold text-[#152d4a] border border-[#152d4a]/30 rounded-xl hover:bg-[#152d4a]/5 transition-colors duration-150"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#152d4a] to-[#14b8a6] rounded-xl hover:opacity-90 transition-opacity duration-150 shadow-sm"
            >
              Get Started
            </Link>
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              /* X icon */
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              /* Hamburger icon */
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu Panel ── */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-slate-100 bg-white",
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="px-4 py-4 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 text-sm font-medium text-slate-700 hover:text-[#0f2037] hover:bg-slate-50 rounded-xl transition-colors duration-150"
            >
              {link.label}
            </Link>
          ))}

          {/* Mobile CTA buttons */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/sign-in"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center px-4 py-2.5 text-sm font-semibold text-[#152d4a] border border-[#152d4a]/30 rounded-xl hover:bg-[#152d4a]/5 transition-colors duration-150"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#152d4a] to-[#14b8a6] rounded-xl hover:opacity-90 transition-opacity duration-150"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
