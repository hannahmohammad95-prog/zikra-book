"use client";

import { motion } from "framer-motion";

// Staggered reveal: each child animates in with a delay
const container = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.18 } },
};

const item = {
  hidden: { opacity: 0, y: 50 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-cream-50 overflow-hidden px-6 text-center">

      {/* Soft radial glow in the background */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 60%, rgba(196,154,90,0.12) 0%, transparent 70%)",
        }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-4xl"
      >
        {/* Eyebrow label */}
        <motion.p variants={item} className="text-gold-500 text-xs tracking-[0.35em] uppercase mb-6 font-sans">
          Handcrafted for Every Journey
        </motion.p>

        {/* Main headline */}
        <motion.h1
          variants={item}
          className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.05] text-ink-900 mb-6"
        >
          Your memories,
          <br />
          <span className="text-gold-shimmer">bound in gold.</span>
        </motion.h1>

        {/* Sub-copy */}
        <motion.p
          variants={item}
          className="text-ink-700 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10 font-sans"
        >
          Zikra transforms your most precious photographs — your travels, your
          celebrations, your milestones — into a cinematic heirloom book you will pass down for generations.
        </motion.p>

        {/* CTA buttons */}
        <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/create"
            className="px-8 py-4 bg-gold-gradient text-cream-50 rounded-full text-sm tracking-widest font-medium hover:opacity-90 transition-opacity shadow-lg"
          >
            CREATE MY BOOK
          </a>
          <a
            href="#story"
            className="px-8 py-4 border border-gold-400 text-gold-600 rounded-full text-sm tracking-widest font-medium hover:bg-gold-400/10 transition-colors"
          >
            OUR STORY
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-10 flex flex-col items-center gap-2 text-gold-400"
      >
        <span className="text-xs tracking-widest">SCROLL</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
          className="w-px h-8 bg-gradient-to-b from-gold-400 to-transparent"
        />
      </motion.div>
    </section>
  );
}
