/**
 * (public) Route Group Layout
 *
 * Wraps all public-facing pages (landing, sign-in, sign-up, about, etc.)
 * with the public navigation bar and a shared footer.
 *
 * No auth check here — pages in this group are freely accessible.
 */

import { PublicNav } from "@/components/layout/PublicNav";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-slate-100 py-8 text-center text-sm text-slate-400">
        © 2025 NEXORA · Discover Potential. Transform Learning. Unlock
        Opportunity.
      </footer>
    </div>
  );
}
