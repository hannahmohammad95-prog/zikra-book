"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Nav from "@/components/Nav";

const categories = [
  {
    slug:        "travel",
    emoji:       "✈️",
    title:       "Travel",
    description: "Pick your destination and we'll craft a book around your adventure.",
    accent:      "سفر",
  },
  {
    slug:        "occasions",
    emoji:       "🎉",
    title:       "Occasions",
    description: "Weddings, birthdays, graduations, pregnancies — every milestone deserves a page.",
    accent:      "فرح",
  },
  {
    slug:        "family",
    emoji:       "👨‍👩‍👧",
    title:       "Family",
    description: "Siblings, Mother's Day, Father's Day — celebrate the people who matter most.",
    accent:      "عائلة",
  },
];

const container = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1 } },
};

const card = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function CreatePage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-cream-50 pt-32 pb-24 px-6">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-gold-500 text-xs tracking-[0.35em] uppercase mb-4 font-sans"
          >
            Step 1 of 3
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-4xl md:text-6xl text-ink-900 mb-4 leading-tight"
          >
            What is this book for?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-ink-700 font-sans text-base max-w-md mx-auto"
          >
            Choose your occasion and we will tailor every page to match your story.
          </motion.p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {categories.map((cat) => (
            <motion.div key={cat.slug} variants={card}>
              <Link
                href={`/create/${cat.slug}`}
                className="group relative block rounded-2xl border border-gold-400/20 bg-white overflow-hidden hover:border-gold-400/60 hover:shadow-xl transition-all duration-300"
              >
                <span
                  className="absolute bottom-3 right-4 text-6xl text-gold-400/10 font-serif select-none group-hover:text-gold-400/20 transition-colors duration-300"
                  style={{ fontFamily: "var(--font-arabic)" }}
                >
                  {cat.accent}
                </span>
                <div className="relative p-8">
                  <div className="text-4xl mb-4">{cat.emoji}</div>
                  <h2 className="font-serif text-xl text-ink-900 mb-2 group-hover:text-gold-600 transition-colors duration-200">
                    {cat.title}
                  </h2>
                  <p className="text-ink-700 text-sm font-sans leading-relaxed">
                    {cat.description}
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-gold-500 text-xs tracking-widest uppercase font-sans">
                    <span>Choose</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </>
  );
}
