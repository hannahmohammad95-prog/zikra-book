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
  title: {
    default:  "Zikra Book — Preserve Qatar, Forever",
    template: "%s | Zikra Book",
  },
  description: "Cinematic travel photo books crafted from your memories of Qatar. Heirloom quality, museum-grade print, delivered to your door.",
  keywords: [
    "photo book Qatar",
    "travel photo book",
    "custom photo book Doha",
    "memory book Qatar",
    "heirloom photo book",
    "زكرى",
    "كتاب صور",
    "photo album Qatar",
  ],
  authors: [{ name: "Zikra Book", url: "https://zikrabook.com" }],
  metadataBase: new URL("https://zikrabook.com"),
  openGraph: {
    title:       "Zikra Book — Preserve Qatar, Forever",
    description: "Your memories of Qatar, bound in gold. Heirloom-quality travel photo books, delivered to your door.",
    siteName:    "Zikra Book",
    url:         "https://zikrabook.com",
    locale:      "en_US",
    type:        "website",
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Zikra Book — Preserve Qatar, Forever",
    description: "Your memories of Qatar, bound in gold.",
  },
  robots: {
    index:  true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${arabic.variable} ${cormorant.variable}`}>
      <body>{children}</body>
    </html>
  );
}
