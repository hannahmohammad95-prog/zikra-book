"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function BookViewer() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Full 360° feel — rotates from tilted left to tilted right as you scroll
  const rotateY = useTransform(scrollYProgress, [0, 1], [-35, 35]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [10, 0, -10]);
  const scale   = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.85, 1, 1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={ref}
      id="story"
      className="min-h-screen flex flex-col items-center justify-center bg-cream-50 px-6 py-24"
    >
      {/* Soft gold glow behind the book */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          width: "600px",
          height: "600px",
          background: "radial-gradient(ellipse, rgba(196,154,90,0.15) 0%, transparent 70%)",
        }}
      />

      {/* Eyebrow */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-gold-500 text-xs tracking-[0.35em] uppercase mb-4 font-sans"
      >
        Crafted for Keeps
      </motion.p>

      {/* Headline */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="font-serif text-4xl md:text-6xl text-ink-900 text-center mb-16 max-w-xl leading-tight"
      >
        A book that holds<br />the weight of a place.
      </motion.h2>

      {/* 3D Book */}
      <div className="relative" style={{ perspective: "1400px" }}>
        <motion.div
          style={{ rotateY, rotateX, scale, opacity }}
          className="relative"
          transition={{ type: "spring", stiffness: 40, damping: 20 }}
        >
          {/* Book wrapper — large and dramatic */}
          <div className="relative w-72 h-96 md:w-96 md:h-[30rem]">

            {/* Front cover */}
            <div
              className="absolute inset-0 rounded-r-xl flex items-center justify-center overflow-hidden"
              style={{
                background: "linear-gradient(160deg, #D4B483 0%, #8A6225 55%, #2E2010 100%)",
                boxShadow: "12px 16px 60px rgba(107,74,16,0.5), -4px 0 16px rgba(0,0,0,0.25)",
              }}
            >
              {/* Subtle texture overlay */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
                }}
              />

              {/* Cover text */}
              <div className="relative text-center px-10">
                <div className="mb-6 mx-auto w-10 h-px bg-cream-50/30" />
                <p className="text-cream-50/50 text-[10px] tracking-[0.5em] uppercase mb-4 font-sans">
                  Zikra Book
                </p>
                <p className="font-serif text-cream-50 text-3xl leading-snug mb-2">
                  ذكرى
                </p>
                <p className="font-serif text-cream-50/60 text-sm italic">
                  every journey deserves a page
                </p>
                <div className="mt-6 mx-auto w-10 h-px bg-cream-50/30" />
              </div>
            </div>

            {/* Spine */}
            <div
              className="absolute left-0 top-2 bottom-2 w-6"
              style={{
                background: "linear-gradient(to right, #1A1208, #3D2D18)",
                transform: "translateX(-22px) rotateY(-90deg)",
                transformOrigin: "right center",
                boxShadow: "-6px 0 20px rgba(0,0,0,0.4)",
              }}
            />

            {/* Page stack */}
            <div
              className="absolute right-0 top-3 bottom-3 w-4 bg-cream-100 rounded-r-sm"
              style={{ boxShadow: "inset -3px 0 8px rgba(0,0,0,0.08), 2px 0 4px rgba(0,0,0,0.05)" }}
            />
          </div>
        </motion.div>
      </div>

      {/* Caption */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.4 }}
        className="mt-16 text-ink-700 text-center max-w-md leading-relaxed font-sans text-sm"
      >
        Printed on 250gsm art paper. Smyth-sewn. Finished with a cloth cover
        embossed in 22k foil. Not a photobook — an artifact.
      </motion.p>
    </section>
  );
}
