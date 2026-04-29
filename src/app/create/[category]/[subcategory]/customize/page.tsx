"use client";

import { useState, useRef, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Nav from "@/components/Nav";
import { SYMBOLS } from "@/data/symbols";

function toTitle(slug: string) {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

// ── Pastel colour palette ─────────────────────────────────────────────────────
const PALETTE = [
  // Blues
  "#3BAEE8", "#55B4E8", "#7BC4E8", "#96CDE8", "#B2D8E8", "#C4E0E8", "#D6E8EC", "#E5EEF2",
  // Greens / Sage / Tan
  "#7CC47A", "#8CC87C", "#9EC87E", "#A8CA84", "#B0CA94", "#BCBCA0", "#C8B4A8", "#DCC8B8",
  // Yellows / Pale orange
  "#F4E840", "#F4EE65", "#F5F088", "#F5F0A8", "#F5EAB8", "#F5E4B0", "#F5D8A0", "#F5C890",
  // Peach / Skin / Mauve
  "#F2AE8C", "#F0BEAA", "#F0C8B8", "#EECCC4", "#ECC4CC", "#E8BCD4", "#E0B8DC", "#D8B2DC",
  // Pinks
  "#F07C90", "#EE7298", "#EC6C94", "#EC648E", "#E85888", "#E44882", "#DA407C", "#CE3E78",
  // Pink / Lavender / Periwinkle
  "#F08CB0", "#E882C4", "#D880CC", "#C89CDC", "#B8AEE8", "#A8BCE8", "#96C4F4",
  // Rose / Salmon / Orange
  "#C882A8", "#D88898", "#E89898", "#F09898", "#F0A888", "#F0AE7A", "#EFB46A", "#F0A840",
];

// Cover is rendered at 210px wide × 280px tall in the preview.
// Text max ~100px lets even short names fill edge-to-edge.
// Icon max 195px (just inside the 210px cover width).
const TEXT_SIZE_MIN = 18;
const TEXT_SIZE_MAX = 100;
const ICON_SIZE_MIN = 40;
const ICON_SIZE_MAX = 380;

// ── Main page ─────────────────────────────────────────────────────────────────
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

  // State
  const [color,          setColor]          = useState(PALETTE[3]);   // default: nice blue
  const [textSize,       setTextSize]       = useState(42);
  const [iconSize,       setIconSize]       = useState(150);
  const [selectedSymbol, setSelectedSymbol] = useState(symbols[0]?.id ?? "");
  const [year,           setYear]           = useState("");

  // Draggable positions (% of cover width/height)
  const [textPos, setTextPos] = useState({ x: 50, y: 18 });
  const [iconPos, setIconPos] = useState({ x: 50, y: 58 });
  const [dragging, setDragging] = useState<"text" | "icon" | null>(null);
  const coverRef = useRef<HTMLDivElement>(null);

  const selectedSymbolObj = symbols.find((s) => s.id === selectedSymbol);

  // ── Drag logic ──────────────────────────────────────────────────────────────
  const applyMove = useCallback((clientX: number, clientY: number) => {
    if (!dragging || !coverRef.current) return;
    const rect = coverRef.current.getBoundingClientRect();
    const x = Math.max(8, Math.min(92, ((clientX - rect.left) / rect.width)  * 100));
    const y = Math.max(5, Math.min(95, ((clientY - rect.top)  / rect.height) * 100));
    if (dragging === "text") setTextPos({ x, y });
    if (dragging === "icon") setIconPos({ x, y });
  }, [dragging]);

  const onMouseMove = (e: React.MouseEvent) => applyMove(e.clientX, e.clientY);
  const onTouchMove = (e: React.TouchEvent) => { if (e.touches[0]) applyMove(e.touches[0].clientX, e.touches[0].clientY); };
  const stopDrag    = () => setDragging(null);

  function startDrag(el: "text" | "icon") {
    return (e: React.MouseEvent | React.TouchEvent) => { e.preventDefault(); setDragging(el); };
  }

  function handleContinue() {
    const qs = new URLSearchParams({
      pages, notes, template,
      color,
      symbol:   selectedSymbol,
      year,
      textSize: String(textSize),
      iconSize: String(iconSize),
      textX:    String(Math.round(textPos.x)),
      textY:    String(Math.round(textPos.y)),
      iconX:    String(Math.round(iconPos.x)),
      iconY:    String(Math.round(iconPos.y)),
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
            <p className="text-ink-700 font-sans text-sm">Pick a colour, choose a symbol, then drag them into position.</p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-10 items-start">

            {/* ── Book spread preview ────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              className="w-full lg:w-auto flex-shrink-0 flex flex-col items-center lg:sticky lg:top-28"
            >
              <p className="text-xs tracking-widest uppercase text-ink-700 font-sans mb-3">Preview — drag to reposition</p>

              {/* 3-panel spread: Back | Spine | Front */}
              <div className="flex shadow-2xl select-none" style={{ borderRadius: "6px", overflow: "visible" }}>

                {/* Back cover */}
                <div
                  className="relative flex-shrink-0 overflow-hidden"
                  style={{ width: "220px", height: "293px", backgroundColor: color, borderRadius: "6px 0 0 6px" }}
                >
                  <p className="cover-font absolute bottom-6 left-0 right-0 text-center text-white"
                     style={{ fontSize: "22px", letterSpacing: "0.06em", lineHeight: 1 }}>
                    {subTitle.toUpperCase()}
                  </p>
                </div>

                {/* Spine — hard cover, flat */}
                <div
                  className="relative flex-shrink-0"
                  style={{ width: "44px", height: "293px", backgroundColor: color, filter: "brightness(0.72)" }}
                >
                  {/* Country name — upper portion */}
                  <div className="absolute left-0 right-0 flex justify-center" style={{ top: "12%" }}>
                    <p className="cover-font text-white"
                       style={{
                         fontSize: "11px",
                         letterSpacing: "0.22em",
                         writingMode: "vertical-rl",
                         transform: "rotate(180deg)",
                         whiteSpace: "nowrap",
                       }}>
                      {subTitle.toUpperCase()}
                    </p>
                  </div>
                  {/* Year — lower portion */}
                  <div className="absolute left-0 right-0 flex justify-center" style={{ bottom: "12%" }}>
                    <p className="cover-font text-white"
                       style={{
                         fontSize: "11px",
                         letterSpacing: "0.22em",
                         writingMode: "vertical-rl",
                         transform: "rotate(180deg)",
                         whiteSpace: "nowrap",
                       }}>
                      {year || "YEAR"}
                    </p>
                  </div>
                </div>

                {/* Front cover */}
                <div
                  ref={coverRef}
                  className="relative flex-shrink-0 overflow-hidden"
                  style={{
                    width: "220px", height: "293px",
                    backgroundColor: color,
                    borderRadius: "0 6px 6px 0",
                    cursor: dragging ? "grabbing" : "default",
                  }}
                  onMouseMove={onMouseMove} onMouseUp={stopDrag} onMouseLeave={stopDrag}
                  onTouchMove={onTouchMove} onTouchEnd={stopDrag}
                >
                  {/* Country name — draggable */}
                  <div
                    className="absolute"
                    style={{ left: `${textPos.x}%`, top: `${textPos.y}%`, transform: "translate(-50%,-50%)", cursor: "grab", zIndex: 10 }}
                    onMouseDown={startDrag("text")} onTouchStart={startDrag("text")}
                  >
                    <p className="cover-font" style={{
                      fontSize:      `${textSize}px`,
                      color:         "white",
                      letterSpacing: "0.01em",
                      lineHeight:    1,
                      whiteSpace:    "nowrap",
                    }}>
                      {subTitle.toUpperCase()}
                    </p>
                  </div>

                  {/* Symbol — draggable */}
                  {selectedSymbolObj && (
                    <div
                      className="absolute"
                      style={{ left: `${iconPos.x}%`, top: `${iconPos.y}%`, transform: "translate(-50%,-50%)", cursor: "grab", zIndex: 10 }}
                      onMouseDown={startDrag("icon")} onTouchStart={startDrag("icon")}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedSymbolObj.url}
                        alt={selectedSymbolObj.label}
                        style={{ width: `${iconSize}px`, height: `${iconSize}px`, maxWidth: "none", maxHeight: "none", objectFit: "contain", display: "block", mixBlendMode: "multiply" }}
                        draggable={false}
                      />
                    </div>
                  )}
                </div>

              </div>

              {/* Labels */}
              <div className="flex text-[10px] text-ink-400 font-sans mt-1.5" style={{ width: "484px" }}>
                <span className="text-center" style={{ width: "220px" }}>Back cover</span>
                <span className="text-center" style={{ width: "44px" }}>Spine</span>
                <span className="text-center" style={{ width: "220px" }}>Front cover ✦ drag</span>
              </div>
            </motion.div>

            {/* ── Controls ───────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
              className="flex-1 flex flex-col gap-6"
            >

              {/* Colour swatches */}
              <div className="bg-white rounded-2xl border border-gold-400/20 p-6">
                <h2 className="font-serif text-lg text-ink-900 mb-1">Cover colour</h2>
                <p className="text-ink-400 text-xs font-sans mb-5">Tap a circle to choose your colour.</p>
                <div className="flex flex-wrap gap-3">
                  {PALETTE.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      title={c}
                      className="rounded-full flex-shrink-0 transition-transform active:scale-95"
                      style={{
                        width:  "38px",
                        height: "38px",
                        backgroundColor: c,
                        boxShadow: color === c
                          ? `0 0 0 2px white, 0 0 0 4px ${c}`
                          : "inset 0 0 0 1px rgba(0,0,0,0.08)",
                        transform: color === c ? "scale(1.15)" : "scale(1)",
                        transition: "box-shadow 0.15s, transform 0.15s",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Text size slider */}
              <div className="bg-white rounded-2xl border border-gold-400/20 p-6">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="font-serif text-lg text-ink-900">Text size</h2>
                  <span className="text-gold-500 text-sm font-sans font-medium">{textSize}px</span>
                </div>
                <p className="text-ink-400 text-xs font-sans mb-5">Drag to resize the country name on the cover.</p>
                <div className="relative">
                  <div className="flex items-center justify-between text-[10px] text-ink-300 font-sans mb-1.5">
                    <span>A</span>
                    <span className="text-2xl leading-none">A</span>
                  </div>
                  <input
                    type="range"
                    min={TEXT_SIZE_MIN} max={TEXT_SIZE_MAX}
                    value={textSize}
                    onChange={(e) => setTextSize(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer accent-amber-400"
                    style={{ background: `linear-gradient(to right, #D4B483 0%, #D4B483 ${((textSize - TEXT_SIZE_MIN) / (TEXT_SIZE_MAX - TEXT_SIZE_MIN)) * 100}%, #E8D9A8 ${((textSize - TEXT_SIZE_MIN) / (TEXT_SIZE_MAX - TEXT_SIZE_MIN)) * 100}%, #E8D9A8 100%)` }}
                  />
                </div>
              </div>

              {/* Icon size slider */}
              <div className="bg-white rounded-2xl border border-gold-400/20 p-6">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="font-serif text-lg text-ink-900">Symbol size</h2>
                  <span className="text-gold-500 text-sm font-sans font-medium">{iconSize}px</span>
                </div>
                <p className="text-ink-400 text-xs font-sans mb-5">Drag to resize the symbol on the cover.</p>
                <div className="relative">
                  <div className="flex items-center justify-between text-ink-300 font-sans mb-1.5">
                    <span className="text-xs">⬡</span>
                    <span className="text-2xl leading-none">⬡</span>
                  </div>
                  <input
                    type="range"
                    min={ICON_SIZE_MIN} max={ICON_SIZE_MAX}
                    value={iconSize}
                    onChange={(e) => setIconSize(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer accent-amber-400"
                    style={{ background: `linear-gradient(to right, #D4B483 0%, #D4B483 ${((iconSize - ICON_SIZE_MIN) / (ICON_SIZE_MAX - ICON_SIZE_MIN)) * 100}%, #E8D9A8 ${((iconSize - ICON_SIZE_MIN) / (ICON_SIZE_MAX - ICON_SIZE_MIN)) * 100}%, #E8D9A8 100%)` }}
                  />
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
                            ? "border-gold-400 bg-amber-50 shadow-md"
                            : "border-gold-400/20 bg-cream-100 hover:border-gold-400/50"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={sym.url}
                          alt={sym.label}
                          className="w-16 h-16 object-contain"
                          style={{ mixBlendMode: "multiply" }}
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

              {/* Year */}
              <div className="bg-white rounded-2xl border border-gold-400/20 p-6">
                <h2 className="font-serif text-lg text-ink-900 mb-1">Year of your trip</h2>
                <p className="text-ink-400 text-xs font-sans mb-4">Printed on the spine of your book.</p>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="e.g. 2024"
                  min={1900} max={2099}
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
