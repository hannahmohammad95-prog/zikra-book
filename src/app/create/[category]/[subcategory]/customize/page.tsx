"use client";

import { useState, useRef, useCallback } from "react";
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

  // Draggable positions (percentage of cover width/height)
  const [textPos, setTextPos] = useState({ x: 50, y: 18 });
  const [iconPos, setIconPos] = useState({ x: 50, y: 58 });
  const [dragging, setDragging] = useState<"text" | "icon" | null>(null);
  const coverRef = useRef<HTMLDivElement>(null);

  const coverColor = `hsl(${hue}, 45%, 85%)`;
  const selectedSymbolObj = symbols.find((s) => s.id === selectedSymbol);

  // ── Drag handlers ─────────────────────────────────────────────────────────
  const applyMove = useCallback((clientX: number, clientY: number) => {
    if (!dragging || !coverRef.current) return;
    const rect = coverRef.current.getBoundingClientRect();
    const x = Math.max(8, Math.min(92, ((clientX - rect.left) / rect.width)  * 100));
    const y = Math.max(5, Math.min(95, ((clientY - rect.top)  / rect.height) * 100));
    if (dragging === "text") setTextPos({ x, y });
    if (dragging === "icon") setIconPos({ x, y });
  }, [dragging]);

  const onMouseMove  = (e: React.MouseEvent)  => applyMove(e.clientX, e.clientY);
  const onTouchMove  = (e: React.TouchEvent)  => { if (e.touches[0]) applyMove(e.touches[0].clientX, e.touches[0].clientY); };
  const stopDrag     = ()                      => setDragging(null);

  function startDrag(el: "text" | "icon") {
    return (e: React.MouseEvent | React.TouchEvent) => { e.preventDefault(); setDragging(el); };
  }

  function handleContinue() {
    const qs = new URLSearchParams({
      pages, notes, template,
      hue:    String(hue),
      symbol: selectedSymbol,
      year,
      textX:  String(Math.round(textPos.x)),
      textY:  String(Math.round(textPos.y)),
      iconX:  String(Math.round(iconPos.x)),
      iconY:  String(Math.round(iconPos.y)),
    });
    router.push(`/create/${category}/${subcategory}/upload?${qs.toString()}`);
  }

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-cream-50 pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <p className="text-gold-500 text-xs tracking-[0.35em] uppercase mb-4 font-sans">Step 3 of 4</p>
            <h1 className="font-serif text-4xl md:text-5xl text-ink-900 mb-3 leading-tight">Design your cover</h1>
            <p className="text-ink-700 font-sans text-sm">Choose a colour, pick a symbol, and drag them into position.</p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-10 items-start">

            {/* ── Live cover preview ──────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="w-full lg:w-72 flex-shrink-0 flex flex-col items-center"
            >
              <p className="text-xs tracking-widest uppercase text-ink-700 font-sans mb-3">
                Preview — drag to reposition
              </p>

              {/* Cover canvas */}
              <div
                ref={coverRef}
                className="relative rounded-md shadow-2xl overflow-hidden select-none"
                style={{
                  width:           "210px",
                  aspectRatio:     "3/4",
                  backgroundColor: coverColor,
                  cursor:          dragging ? "grabbing" : "default",
                }}
                onMouseMove={onMouseMove}
                onMouseUp={stopDrag}
                onMouseLeave={stopDrag}
                onTouchMove={onTouchMove}
                onTouchEnd={stopDrag}
              >
                {/* Country name — draggable */}
                <div
                  className="absolute"
                  style={{
                    left:      `${textPos.x}%`,
                    top:       `${textPos.y}%`,
                    transform: "translate(-50%, -50%)",
                    cursor:    "grab",
                    zIndex:    10,
                  }}
                  onMouseDown={startDrag("text")}
                  onTouchStart={startDrag("text")}
                >
                  <p
                    style={{
                      fontFamily:    "BobbyJones, 'Bebas Neue', Impact, sans-serif",
                      fontSize:      "34px",
                      fontWeight:    900,
                      color:         "white",
                      letterSpacing: "0.08em",
                      lineHeight:    1,
                      whiteSpace:    "nowrap",
                      textShadow:    "0 2px 10px rgba(0,0,0,0.2)",
                      WebkitTextStroke: "0px",
                    }}
                  >
                    {subTitle.toUpperCase()}
                  </p>
                  {/* Drag hint ring */}
                  <div className="absolute -inset-2 rounded border border-white/30 border-dashed opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
                </div>

                {/* Symbol — draggable */}
                {selectedSymbolObj && (
                  <div
                    className="absolute"
                    style={{
                      left:      `${iconPos.x}%`,
                      top:       `${iconPos.y}%`,
                      transform: "translate(-50%, -50%)",
                      cursor:    "grab",
                      zIndex:    10,
                    }}
                    onMouseDown={startDrag("icon")}
                    onTouchStart={startDrag("icon")}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedSymbolObj.url}
                      alt={selectedSymbolObj.label}
                      style={{
                        width:         "130px",
                        height:        "130px",
                        objectFit:     "contain",
                        mixBlendMode:  "multiply",
                        display:       "block",
                      }}
                      draggable={false}
                    />
                    <div className="absolute -inset-2 rounded border border-white/30 border-dashed opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                )}
              </div>

              {/* Spine preview */}
              <div
                className="flex flex-row items-center gap-3 mt-3 rounded px-4 py-1.5"
                style={{ backgroundColor: coverColor }}
              >
                <p style={{ fontFamily: "BobbyJones, 'Bebas Neue', Impact, sans-serif", color: "white", fontSize: "13px", letterSpacing: "0.15em" }}>
                  {subTitle.toUpperCase()}
                </p>
                {year && <p className="text-white/70 text-[10px] font-sans">{year}</p>}
              </div>
              <p className="text-ink-400 text-[10px] font-sans mt-1">↑ Spine</p>

              <p className="text-ink-400 text-[11px] font-sans mt-4 text-center max-w-[200px] leading-relaxed">
                ✦ Drag the text and icon anywhere on the cover
              </p>
            </motion.div>

            {/* ── Controls ────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="flex-1 flex flex-col gap-6"
            >

              {/* Colour slider */}
              <div className="bg-white rounded-2xl border border-gold-400/20 p-6">
                <h2 className="font-serif text-lg text-ink-900 mb-1">Cover colour</h2>
                <p className="text-ink-400 text-xs font-sans mb-5">Slide to pick any colour for your book cover.</p>
                <div
                  className="relative h-10 rounded-full cursor-pointer"
                  style={{ background: "linear-gradient(to right, hsl(270,50%,82%), hsl(210,55%,82%), hsl(150,45%,82%), hsl(60,50%,84%), hsl(30,60%,82%), hsl(350,55%,82%))" }}
                >
                  <input
                    type="range" min={0} max={360} value={hue}
                    onChange={(e) => setHue(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-4 border-white shadow-lg pointer-events-none transition-all duration-75"
                    style={{ left: `calc(${(hue / 360) * 100}% - 16px)`, backgroundColor: coverColor }}
                  />
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <div className="w-7 h-7 rounded-full border border-white shadow" style={{ backgroundColor: coverColor }} />
                  <p className="text-ink-700 text-sm font-sans">Selected colour</p>
                </div>
              </div>

              {/* Symbol picker */}
              {symbols.length > 0 && (
                <div className="bg-white rounded-2xl border border-gold-400/20 p-6">
                  <h2 className="font-serif text-lg text-ink-900 mb-1">Choose a symbol</h2>
                  <p className="text-ink-400 text-xs font-sans mb-5">Pick one icon — then drag it into position on the cover.</p>
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
                        <img src={sym.url} alt={sym.label} className="w-16 h-16 object-contain" />
                        <p className="text-xs font-sans text-ink-700">{sym.label}</p>
                        {selectedSymbol === sym.id && (
                          <span className="text-[10px] tracking-widest text-gold-500 font-sans">✓ SELECTED</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Year */}
              <div className="bg-white rounded-2xl border border-gold-400/20 p-6">
                <h2 className="font-serif text-lg text-ink-900 mb-1">Year of your trip</h2>
                <p className="text-ink-400 text-xs font-sans mb-5">Printed on the spine of your book.</p>
                <input
                  type="number" value={year} onChange={(e) => setYear(e.target.value)}
                  placeholder="e.g. 2024" min={1900} max={2099}
                  className="w-40 border border-gold-400/30 rounded-lg px-4 py-3 text-sm font-sans text-ink-900 bg-cream-50 focus:outline-none focus:border-gold-400 transition-colors placeholder:text-ink-300"
                />
              </div>

            </motion.div>
          </div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 items-center mt-10"
          >
            <button onClick={() => router.back()} className="text-ink-700 text-sm font-sans hover:text-gold-500 transition-colors">
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
