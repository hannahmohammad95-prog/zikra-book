import type { Metadata } from "next";
import { Inter, Playfair_Display, Noto_Naskh_Arabic, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

// Google Fonts loaded via Next.js — zero layout shift, zero external request
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const arabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["400"],
  variable: "--font-arabic",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title:       "Zikra Book — Preserve Qatar, Forever",
  description: "Cinematic travel photo books crafted from your memories of Qatar. Heirloom quality. Delivered to your door.",
  openGraph: {
    title:       "Zikra Book",
    description: "Your Qatar memories, bound in gold.",
    siteName:    "Zikra Book",
    locale:      "en_US",
    type:        "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${arabic.variable} ${cormorant.variable}`}>
      <body>{children}</body>
    </html>
  );
}
