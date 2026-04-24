"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Beige/linen book colours — calm and premium
const COVER_BG   = "linear-gradient(160deg, #F0E6D0 0%, #E2D0B0 50%, #D4BC90 100%)";
const COVER_SHADOW = "12px 16px 60px rgba(180,150,100,0.25), -4px 0 16px rgba(0,0,0,0.08)";
const SPINE_BG   = "linear-gradient(to left, #E2D0B0, #D4BC90)";
const TEXT_COLOR = "#5C4A2A";

export default function BookViewer() {
  const ref = useRef<HTMLDivElement>(null);

  // Make the section 200vh so scrolling is slower and the rotation feels cinematic
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Rock from -45° → facing you → 45°
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-45, 0, 45]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [5, 0, -5]);
  const scale   = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.88, 1, 1, 0.88]);
  const opacity = useTransform(scrollYProgress, [0, 0.12, 0.88, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={ref}
      id="story"
      className="flex flex-col items-center justify-center bg-cream-50 px-6 py-32"
      style={{ minHeight: "160vh" }}
    >
      {/* Soft warm glow */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          width: "500px",
          height: "500px",
          background: "radial-gradient(ellipse, rgba(212,188,144,0.18) 0%, transparent 70%)",
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
        >
          <div className="relative w-72 h-96 md:w-96 md:h-[30rem]">

            {/* Front cover — off-white / linen beige */}
            <div
              className="absolute inset-0 rounded-l-sm rounded-r-xl flex items-center justify-center overflow-hidden"
              style={{ background: COVER_BG, boxShadow: COVER_SHADOW }}
            >
              {/* Subtle linen texture */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(180,150,100,0.04) 3px, rgba(180,150,100,0.04) 4px)",
                }}
              />

              {/* Cover text — mirrors the logo exactly */}
              <div className="relative text-center px-8 flex flex-col items-center gap-2">
                {/* Arabic — same font as logo */}
                <p
                  className="text-3xl leading-none"
                  style={{
                    fontFamily: "var(--font-arabic)",
                    direction: "rtl",
                    color: TEXT_COLOR,
                  }}
                >
                  ذكرى
                </p>

                {/* Gold divider — same as logo */}
                <div className="w-12 h-px" style={{ background: "#C4A882", opacity: 0.7 }} />

                {/* English — same font as logo */}
                <p
                  className="text-[10px] tracking-[0.28em] uppercase"
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontWeight: 300,
                    color: TEXT_COLOR,
                    opacity: 0.8,
                  }}
                >
                  Zikra Book
                </p>

                {/* Tagline */}
                <p
                  className="text-[10px] italic mt-2 leading-relaxed"
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontWeight: 300,
                    color: TEXT_COLOR,
                    opacity: 0.55,
                    letterSpacing: "0.05em",
                  }}
                >
                  every journey deserves a page
                </p>
              </div>
            </div>

            {/* Spine — RIGHT side, same colour as cover */}
            <div
              className="absolute right-0 top-2 bottom-2 w-6"
              style={{
                background: SPINE_BG,
                transform: "translateX(22px) rotateY(90deg)",
                transformOrigin: "left center",
                boxShadow: "6px 0 20px rgba(0,0,0,0.08)",
              }}
            />

            {/* Page stack — LEFT side */}
            <div
              className="absolute left-0 top-3 bottom-3 w-4 rounded-l-sm"
              style={{
                background: "linear-gradient(to right, #F5F0E8, #EDE4D0)",
                boxShadow: "inset 3px 0 8px rgba(0,0,0,0.06)",
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.4 }}
        className="mt-16 text-ink-700 text-center max-w-md leading-relaxed font-sans text-sm"
      >
        A4 format. Matte cover. Double-sided laminated photos inside.
        Every page crafted to hold a memory that lasts forever.
      </motion.p>
    </section>
  );
}
