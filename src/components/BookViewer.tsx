"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// 3D book that rotates as the user scrolls into view.
// Built with CSS 3D transforms — no WebGL needed.
export default function BookViewer() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Map scroll 0→1 to rotation -20deg → 20deg
  const rotateY = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [8, 0, -8]);

  return (
    <section
      ref={ref}
      id="story"
      className="py-32 px-6 bg-cream-100 flex flex-col items-center"
    >
      <p className="text-gold-500 text-xs tracking-[0.35em] uppercase mb-4">The Object</p>
      <h2 className="font-serif text-4xl md:text-5xl text-ink-900 text-center mb-16 max-w-xl leading-tight">
        A book that holds the weight of a place.
      </h2>

      {/* 3D book container */}
      <div className="relative" style={{ perspective: "1200px" }}>
        <motion.div
          style={{ rotateY, rotateX }}
          className="relative w-64 h-80 md:w-80 md:h-96"
          transition={{ type: "spring", stiffness: 60 }}
        >
          {/* Front cover */}
          <div
            className="absolute inset-0 rounded-r-lg shadow-2xl flex items-center justify-center overflow-hidden"
            style={{
              background: "linear-gradient(160deg, #D4B483 0%, #8A6225 60%, #3D2D18 100%)",
              boxShadow: "8px 8px 40px rgba(107,74,16,0.4), -2px 0 8px rgba(0,0,0,0.2)",
            }}
          >
            <div className="text-center px-8">
              <p className="text-cream-50/60 text-xs tracking-[0.4em] uppercase mb-3">Zikra</p>
              <p className="font-serif text-cream-50 text-2xl leading-snug">Qatar</p>
              <p className="font-serif text-cream-50/70 text-sm mt-1 italic">2024</p>
              {/* Emboss line decoration */}
              <div className="mt-6 mx-auto w-12 h-px bg-cream-50/40" />
            </div>
          </div>

          {/* Book spine (left edge) */}
          <div
            className="absolute left-0 top-1 bottom-1 w-5 rounded-l-sm"
            style={{
              background: "linear-gradient(to right, #3D2D18, #6B4A10)",
              transform: "translateX(-18px) rotateY(-90deg)",
              transformOrigin: "right center",
              boxShadow: "-4px 0 12px rgba(0,0,0,0.3)",
            }}
          />

          {/* Page stack (right edge illusion) */}
          <div
            className="absolute right-0 top-2 bottom-2 w-3 bg-cream-200 rounded-r-sm"
            style={{ boxShadow: "inset -2px 0 6px rgba(0,0,0,0.1)" }}
          />
        </motion.div>
      </div>

      <p className="mt-16 text-ink-700 text-center max-w-lg leading-relaxed font-sans">
        Each Zikra book is printed on 250gsm art paper, smyth-sewn, and finished
        with a cloth-wrapped cover embossed in 22k foil. It is not a photobook.
        It is an artifact.
      </p>
    </section>
  );
}
