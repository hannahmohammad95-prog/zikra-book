"use client";

import { useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Nav from "@/components/Nav";
import { SYMBOLS } from "@/data/symbols";

function toTitle(slug: string) {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export default function CustomizePage() {
  const params       = useParams();
  const searchParams = useSearchParams();
  const router       = useRouter();

  const category    = typeof params.category    === "string" ? params.category    : "";
  const subcategory = typeof params.subcategory === "string" ? params.subcategory : "";
  const subTitle    = toTitle(subcategory);

  const pages    = searchParams.get("pages")    ?? "40";
  const notes    = searchParams.get("notes")    ?? "";
  const template = searchParams.get("template") ?? "";

  const symbols = SYMBOLS[subcategory] ?? [];

  const [hue,            setHue]            = useState(210);
  const [selectedSymbol, setSelectedSymbol] = useState(symbols[0]?.id ?? "");
  const [year,           setYear]           = useState("");

  // Cover gradient from chosen hue — vivid, saturated colours
  const coverGradient = `linear-gradient(180deg, hsl(${hue}, 90%, 52%), hsl(${hue}, 100%, 32%))`;

  function handleContinue() {
    const qs = new URLSearchParams({
      pages, notes, template,
      hue:    String(hue),
      symbol: selectedSymbol,
      year,
    });
    router.push(`/create/${category}/${subcategory}/upload?${qs.toString()}`);
  }

  const selectedSymbolObj = symbols.find((s) => s.id === selectedSymbol);

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-cream-50 pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <p className="text-gold-500 text-xs tracking-[0.35em] uppercase mb-4 font-sans">
              Step 3 of 4
            </p>
            <h1 className="font-serif text-4xl md:text-5xl text-ink-900 mb-3 leading-tight">
              Design your cover
            </h1>
            <p className="text-ink-700 font-sans text-sm">
              Choose a colour, pick a symbol, and add the year of your trip.
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-10 items-start">

            {/* ── Live cover preview ─────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="w-full lg:w-64 flex-shrink-0 flex flex-col items-center"
            >
              <p className="text-xs tracking-widest uppercase text-ink-700 font-sans mb-4">Preview</p>

              {/* Book cover */}
              <div
                className="w-52 rounded-lg shadow-2xl flex flex-col items-center transition-all duration-300 overflow-hidden"
                style={{
                  aspectRatio: "3/4",
                  background:  coverGradient,
                  paddingTop:  "28px",
                }}
              >
                {/* Country name — top middle, all caps */}
                <p
                  className="text-white text-center px-4 leading-tight w-full"
                  style={{
                    fontFamily:    "var(--font-bebas)",
                    fontSize:      "26px",
                    letterSpacing: "0.22em",
                    textShadow:    "0 1px 8px rgba(0,0,0,0.3)",
                  }}
                >
                  {subTitle.toUpperCase()}
                </p>

                {/* Divider line */}
                <div className="w-10 h-px bg-white/40 mt-2 mb-4" />

                {/* Symbol — below the name */}
                {selectedSymbolObj && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedSymbolObj.url}
                    alt={selectedSymbolObj.label}
                    className="w-28 h-28 object-contain drop-shadow-lg"
                  />
                )}

                {/* Year — bottom */}
                {year && (
                  <p
                    className="text-white/70 text-[10px] tracking-[0.3em] font-sans mt-auto mb-4"
                    style={{ textShadow: "0 1px 4px rgba(0,0,0,0.2)" }}
                  >
                    {year}
                  </p>
                )}
              </div>

              <p className="text-ink-400 text-[10px] font-sans mt-3 text-center">
                Live preview — updates as you choose
              </p>
            </motion.div>

            {/* ── Controls ───────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="flex-1 flex flex-col gap-8"
            >

              {/* Color slider */}
              <div className="bg-white rounded-2xl border border-gold-400/20 p-6">
                <h2 className="font-serif text-lg text-ink-900 mb-1">Cover colour</h2>
                <p className="text-ink-400 text-xs font-sans mb-5">Slide to choose any colour for your book cover.</p>

                {/* Rainbow track + thumb */}
                <div
                  className="relative h-10 rounded-full cursor-pointer"
                  style={{
                    background: "linear-gradient(to right, #ff0000, #ff8000, #ffff00, #00ff00, #00ffff, #0080ff, #8000ff, #ff00ff, #ff0000)",
                  }}
                >
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={hue}
                    onChange={(e) => setHue(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {/* Custom thumb */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-4 border-white shadow-lg pointer-events-none transition-all duration-75"
                    style={{
                      left:            `calc(${(hue / 360) * 100}% - 16px)`,
                      backgroundColor: `hsl(${hue}, 90%, 50%)`,
                    }}
                  />
                </div>

                {/* Colour chip */}
                <div className="flex items-center gap-3 mt-4">
                  <div
                    className="w-8 h-8 rounded-full border border-white shadow"
                    style={{ background: `hsl(${hue}, 90%, 50%)` }}
                  />
                  <p className="text-ink-700 text-sm font-sans">
                    Selected colour — hue {hue}°
                  </p>
                </div>
              </div>

              {/* Symbol picker */}
              {symbols.length > 0 && (
                <div className="bg-white rounded-2xl border border-gold-400/20 p-6">
                  <h2 className="font-serif text-lg text-ink-900 mb-1">Choose a symbol</h2>
                  <p className="text-ink-400 text-xs font-sans mb-5">Pick one icon to appear on your cover.</p>
                  <div className="grid grid-cols-3 gap-4">
                    {symbols.map((sym) => (
                      <button
                        key={sym.id}
                        onClick={() => setSelectedSymbol(sym.id)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                          selectedSymbol === sym.id
                            ? "border-gold-400 bg-gold-400/5 shadow-md"
                            : "border-gold-400/20 hover:border-gold-400/50"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={sym.url}
                          alt={sym.label}
                          className="w-16 h-16 object-contain"
                        />
                        <p className="text-xs font-sans text-ink-700">{sym.label}</p>
                        {selectedSymbol === sym.id && (
                          <span className="text-[10px] tracking-widest text-gold-500 font-sans">✓ SELECTED</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Year input */}
              <div className="bg-white rounded-2xl border border-gold-400/20 p-6">
                <h2 className="font-serif text-lg text-ink-900 mb-1">Year of your trip</h2>
                <p className="text-ink-400 text-xs font-sans mb-5">
                  This will be printed on the spine of your book.
                </p>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="e.g. 2024"
                  min={1900}
                  max={2099}
                  className="w-40 border border-gold-400/30 rounded-lg px-4 py-3 text-sm font-sans text-ink-900 bg-cream-50 focus:outline-none focus:border-gold-400 transition-colors placeholder:text-ink-300"
                />
              </div>

            </motion.div>
          </div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 items-center mt-10"
          >
            <button
              onClick={() => router.back()}
              className="text-ink-700 text-sm font-sans hover:text-gold-500 transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={handleContinue}
              className="flex-1 sm:flex-none px-10 py-4 bg-gold-gradient text-cream-50 rounded-full text-sm tracking-widest font-medium hover:opacity-90 transition-opacity shadow-lg"
            >
              CONTINUE TO UPLOAD →
            </button>
          </motion.div>

        </div>
      </main>
    </>
  );
}
