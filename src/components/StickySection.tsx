"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type Feature = {
  label:    string;
  headline: string;
  body:     string;
  accent:   string; // a short poetic word displayed large in the background
};

const FEATURES: Feature[] = [
  {
    label:    "01 — Photography",
    headline: "Every frame, curated.",
    body:     "Upload your photos and our editorial team hand-selects the 80 that tell your story. No algorithm. No automation. Human eyes, cinematic instinct.",
    accent:   "لقطة",  // Arabic for "shot/frame"
  },
  {
    label:    "02 — Design",
    headline: "Laid out like a film.",
    body:     "Inspired by the pacing of cinema, your book breathes — wide landscape spreads followed by intimate close-ups. Gold rule lines guide the eye through the journey.",
    accent:   "ضوء",   // Arabic for "light"
  },
  {
    label:    "03 — Print",
    headline: "Ink that lasts a century.",
    body:     "Giclée archival printing on heavyweight matte art paper. Colours that remain vivid for 100+ years, independently certified.",
    accent:   "ذاكرة",  // Arabic for "memory"
  },
];

export default function StickySection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target:  containerRef,
    offset:  ["start start", "end end"],
  });

  return (
    <section id="process" ref={containerRef} className="relative" style={{ height: `${FEATURES.length * 100}vh` }}>
      {FEATURES.map((feature, i) => (
        <FeaturePanel key={i} feature={feature} index={i} total={FEATURES.length} scrollYProgress={scrollYProgress} />
      ))}
    </section>
  );
}

function FeaturePanel({
  feature,
  index,
  total,
  scrollYProgress,
}: {
  feature:           Feature;
  index:             number;
  total:             number;
  scrollYProgress:   ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  // Each panel is visible for 1/total of the scroll range
  const start  = index / total;
  const end    = (index + 1) / total;

  const opacity = useTransform(
    scrollYProgress,
    [start, start + 0.05, end - 0.05, end],
    [0,     1,            1,           0]
  );

  const y = useTransform(
    scrollYProgress,
    [start, end],
    ["60px", "-60px"]
  );

  return (
    <motion.div
      style={{ opacity }}
      className="sticky top-0 h-screen flex items-center justify-center bg-cream-50 overflow-hidden"
    >
      {/* Giant background accent word */}
      <p
        aria-hidden
        className="absolute select-none font-serif text-[20vw] text-gold-300/20 leading-none pointer-events-none"
      >
        {feature.accent}
      </p>

      <motion.div style={{ y }} className="relative z-10 max-w-2xl px-6 text-center">
        <p className="text-gold-500 text-xs tracking-[0.35em] uppercase mb-6 font-sans">
          {feature.label}
        </p>
        <h2 className="font-serif text-5xl md:text-6xl text-ink-900 mb-8 leading-tight">
          {feature.headline}
        </h2>
        <p className="text-ink-700 text-lg leading-relaxed font-sans">{feature.body}</p>
      </motion.div>
    </motion.div>
  );
}
