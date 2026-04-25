"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Nav() {
  const { scrollY } = useScroll();

  // Nav background fades in from transparent to cream/90 as user scrolls
  const bg      = useTransform(scrollY, [0, 80], ["rgba(253,250,244,0)", "rgba(253,250,244,0.92)"]);
  const shadow  = useTransform(scrollY, [0, 80], ["0 0 0 rgba(0,0,0,0)", "0 2px 24px rgba(168,124,60,0.12)"]);

  return (
    <motion.nav
      style={{ backgroundColor: bg, boxShadow: shadow }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex flex-col items-center gap-0.5 leading-none group">
          <span
            className="text-ink-900 text-2xl"
            style={{ fontFamily: "var(--font-arabic)", direction: "rtl" }}
          >
            ذكرى
          </span>
          <div className="w-14 h-px bg-gold-400 opacity-70" />
          <span
            className="text-ink-900 text-[11px] tracking-[0.28em] uppercase"
            style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300 }}
          >
            Zikra Book
          </span>
        </Link>

        <div className="flex items-center gap-6 text-sm tracking-wide">
          <Link href="#story"   className="hidden md:block text-ink-700 hover:text-gold-500 transition-colors">Story</Link>
          <Link href="#books"   className="hidden md:block text-ink-700 hover:text-gold-500 transition-colors">Books</Link>
          <Link href="/about"   className="hidden md:block text-ink-700 hover:text-gold-500 transition-colors">About</Link>
          <Link href="/contact" className="hidden md:block text-ink-700 hover:text-gold-500 transition-colors">Contact</Link>
          <Link
            href="#books"
            className="px-5 py-2 bg-gold-gradient text-cream-50 text-xs rounded-full tracking-widest font-medium hover:opacity-90 transition-opacity"
          >
            ORDER NOW
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
