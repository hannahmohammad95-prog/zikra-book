"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Nav from "@/components/Nav";

const categories = [
  {
    slug:        "travel",
    emoji:       "✈️",
    title:       "Travel",
    description: "Dunes, souqs, skylines, adventures. Capture every destination.",
    accent:      "سفر",
  },
  {
    slug:        "wedding",
    emoji:       "💍",
    title:       "Wedding",
    description: "Your love story, beautifully bound. Every glance, every tear, every dance.",
    accent:      "حب",
  },
  {
    slug:        "birthday",
    emoji:       "🎂",
    title:       "Birthday",
    description: "Celebrate the people who matter most. A gift they will keep forever.",
    accent:      "فرح",
  },
  {
    slug:        "pregnancy",
    emoji:       "🤰",
    title:       "Pregnancy Journey",
    description: "From the first scan to the first breath. Every precious moment, preserved.",
    accent:      "حياة",
  },
  {
    slug:        "graduation",
    emoji:       "🎓",
    title:       "Graduation",
    description: "Years of hard work, one beautiful book. The beginning of everything.",
    accent:      "نجاح",
  },
  {
    slug:        "family",
    emoji:       "👨‍👩‍👧‍👦",
    title:       "Family",
    description: "The everyday magic. Laughter, hugs, chaos — all of it worth remembering.",
    accent:      "عائلة",
  },
];

const container = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08 } },
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
        {/* Header */}
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

        {/* Category grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {categories.map((cat) => (
            <motion.div key={cat.slug} variants={card}>
              <Link
                href={`/create/${cat.slug}`}
                className="group relative block rounded-2xl border border-gold-400/20 bg-white overflow-hidden hover:border-gold-400/60 hover:shadow-xl transition-all duration-300"
              >
                {/* Arabic accent — large background word */}
                <span
                  className="absolute bottom-3 right-4 text-6xl text-gold-400/10 font-serif select-none group-hover:text-gold-400/20 transition-colors duration-300"
                  style={{ fontFamily: "var(--font-arabic)" }}
                >
                  {cat.accent}
                </span>

                <div className="relative p-8">
                  {/* Emoji */}
                  <div className="text-4xl mb-4">{cat.emoji}</div>

                  {/* Title */}
                  <h2 className="font-serif text-xl text-ink-900 mb-2 group-hover:text-gold-600 transition-colors duration-200">
                    {cat.title}
                  </h2>

                  {/* Description */}
                  <p className="text-ink-700 text-sm font-sans leading-relaxed">
                    {cat.description}
                  </p>

                  {/* Arrow */}
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
