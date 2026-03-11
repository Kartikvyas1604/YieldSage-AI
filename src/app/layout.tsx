import type { Metadata } from "next";
import { Lora, JetBrains_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/layout/Navbar";

const lora = Lora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "YieldSage AI — DeFi on Autopilot for Everyone",
  description: "YieldSage AI manages your Solana DeFi portfolio automatically. No experience needed — just answer 3 questions and let AI do the rest.",
  keywords: ["Solana", "DeFi", "Yield", "AI Agent", "LP Management", "Kamino", "Meteora", "Credit Score"],
  authors: [{ name: "YieldSage AI" }],
  openGraph: {
    title: "YieldSage AI — Your Money. Growing. On Autopilot.",
    description: "AI-managed DeFi yield on Solana. No experience needed.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YieldSage AI",
    description: "DeFi made simple. AI does everything.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lora.variable} ${jetbrainsMono.variable} ${dmSans.variable} antialiased bg-bg-primary`}
      >
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
