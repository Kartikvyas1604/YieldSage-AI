import type { Metadata } from "next";
import { Playfair_Display, JetBrains_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/layout/Navbar";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CredChain AI — On-Chain Credit Intelligence on Solana",
  description: "The world's first AI-powered on-chain credit scoring agent. Prove your trustworthiness. Unlock undercollateralized lending.",
  keywords: ["Solana", "DeFi", "Credit Score", "AI", "Blockchain", "Lending"],
  authors: [{ name: "CredChain AI" }],
  openGraph: {
    title: "CredChain AI — On-Chain Credit Intelligence",
    description: "The world's first AI-powered on-chain credit scoring agent on Solana",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CredChain AI",
    description: "Your on-chain history. Your financial identity.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${playfair.variable} ${jetbrainsMono.variable} ${dmSans.variable} antialiased`}
      >
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
