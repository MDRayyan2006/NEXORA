import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "NEXORA", template: "%s | NEXORA" },
  description:
    "AI-Powered Learning Intelligence & Human Capability Discovery Platform. Discover Potential. Transform Learning. Unlock Opportunity.",
  keywords: ["AI learning", "EdTech", "capability discovery", "personalized learning"],
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-white antialiased">{children}</body>
    </html>
  );
}
