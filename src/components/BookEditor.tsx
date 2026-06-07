"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Nav from "@/components/Nav";
import { useRouter } from "next/navigation";
import type { UploadedPhoto } from "@/types/book";

// ── Types ─────────────────────────────────────────────────────────────────────
type Layout = "full" | "left" | "right" | "top" | "bottom" | "two" | "two-vertical";

const LAYOUTS: { id: Layout; label: string; icon: string }[] = [
  { id: "full",         label: "Full page",    icon: "⬛" },
  { id: "two-vertical", label: "Top & Bottom", icon: "⬒" },
];

type PageData = {
  layout:  Layout;
  photos:  (UploadedPhoto | null)[];
  borders: number[]; // border thickness in px per slot (0 = no border)
};

const BORDER_PRESETS = [
  { label: "None",   value: 0  },
  { label: "Thin",   value: 4  },
  { label: "Medium", value: 10 },
  { label: "Thick",  value: 20 },
];

type Props = {
  photos:       UploadedPhoto[];
  pages:        number;
  category:     string;
  subcategory?: string;
  color?:       string;
  symbol?:      string;
  year?:        string;
  textSize?:    number;
  iconSize?:    number;
  searchParams: Record<string, string>;
};

// ── Main component ────────────────────────────────────────────────────────────
export default function BookEditor({ photos, pages, category, subcategory, color = "#7eb8d4", symbol = "", year = "", textSize = 42, iconSize = 150, searchParams }: Props) {
  const router = useRouter();

  const totalSides = pages * 2; // each page has a front and a back

  const [pageData, setPageData] = useState<PageData[]>(
    Array.from({ length: totalSides }, () => ({ layout: "full", photos: [null, null], borders: [0, 0] }))
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(0);
  // Which of the two facing pages is being edited (0=left, 1=right)
  const [spreadActiveSide, setSpreadActiveSide] = useState<0 | 1>(0);
  const [showContact, setShowContact] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [name, setName] = useState("");
  const [contactType, setContactType] = useState<"email" | "whatsapp">("email");
  const [contact, setContact] = useState("");
  const [formError, setFormError] = useState("");

  // Always snap to even index so we show a proper left+right pair
  const spreadLeftPage  = currentPage % 2 === 0 ? currentPage : currentPage - 1;
  const spreadRightPage = spreadLeftPage + 1;
  const editingPage     = spreadActiveSide === 0 ? spreadLeftPage : spreadRightPage;

  const page        = pageData[editingPage];
  const filledPages = pageData.filter((p) => p.photos[0] !== null).length;

  // ── Spread preset: sets both pages' layouts at once ──────────────────────────
  type SpreadPreset = "1|1" | "2|2" | "2|1" | "1|2";

  function currentSpreadPreset(): SpreadPreset {
    const l = pageData[spreadLeftPage].layout;
    const r = spreadRightPage < totalSides ? pageData[spreadRightPage].layout : "full";
    if (l === "two-vertical" && r === "two-vertical") return "2|2";
    if (l === "two-vertical") return "2|1";
    if (r === "two-vertical") return "1|2";
    return "1|1";
  }

  function setSpreadPreset(preset: SpreadPreset) {
    const map: Record<SpreadPreset, [Layout, Layout]> = {
      "1|1": ["full",         "full"],
      "2|2": ["two-vertical", "two-vertical"],
      "2|1": ["two-vertical", "full"],
      "1|2": ["full",         "two-vertical"],
    };
    const [leftLayout, rightLayout] = map[preset];
    setPageData((prev) => {
      const next = [...prev];
      next[spreadLeftPage] = { layout: leftLayout,  photos: [null, null], borders: [0, 0] };
      if (spreadRightPage < totalSides) {
        next[spreadRightPage] = { layout: rightLayout, photos: [null, null], borders: [0, 0] };
      }
      return next;
    });
    setSelectedSlot(0);
    setSpreadActiveSide(0);
  }

  // Label each side: "Page 1 — Front", "Page 1 — Back", "Page 2 — Front" …
  function getSideLabel(index: number) {
    const pageNum = Math.floor(index / 2) + 1;
    const side    = index % 2 === 0 ? "Front" : "Back";
    return { pageNum, side, full: `Page ${pageNum} — ${side}` };
  }

  function setLayout(layout: Layout) {
    setPageData((prev) => {
      const next = [...prev];
      next[editingPage] = { layout, photos: [null, null], borders: [0, 0] };
      return next;
    });
    setSelectedSlot(0);
  }

  function setBorder(slot: number, value: number) {
    setPageData((prev) => {
      const next    = [...prev];
      const borders = [...next[editingPage].borders];
      borders[slot] = value;
      next[editingPage] = { ...next[editingPage], borders };
      return next;
    });
  }

  // Place photo into the currently selected slot, respecting the chosen layout
  function assignPhoto(photo: UploadedPhoto) {
    setPageData((prev) => {
      const next  = [...prev];
      const cur   = next[editingPage];
      const slots = [...cur.photos];
      slots[selectedSlot] = photo;
      next[editingPage] = { ...cur, photos: slots };
      return next;
    });
    // Auto-advance to slot 1 after filling slot 0 in two-photo layouts
    const cur = pageData[editingPage];
    if ((cur.layout === "two" || cur.layout === "two-vertical") && selectedSlot === 0) {
      setSelectedSlot(1);
    }
  }

  function clearSlot(slot: number) {
    setPageData((prev) => {
      const next  = [...prev];
      const slots = [...next[editingPage].photos];
      slots[slot] = null;
      next[editingPage] = { ...next[editingPage], photos: slots };
      return next;
    });
  }

  async function handleSubmit() {
    if (!name.trim()) { setFormError("Please enter your name."); return; }
    if (!contact.trim()) {
      setFormError(`Please enter your ${contactType === "email" ? "email address" : "WhatsApp number"}.`);
      return;
    }
    if (contactType === "email" && !/\S+@\S+\.\S+/.test(contact)) {
      setFormError("Please enter a valid email.");
      return;
    }
    setFormError("");
    setSending(true);

    const allPhotos = pageData.flatMap((p) => p.photos.filter(Boolean));

    // Full layout arrangement — every side with its layout and photos
    const arrangement = pageData.map((p, i) => ({
      side:    getSideLabel(i).full,
      layout:  p.layout,
      photos:  p.photos.map((ph) => ph ? { url: ph.url, name: ph.name } : null),
      borders: p.borders,
    }));

    await fetch("/api/order", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        name, contact, contactType,
        category:    category    ?? "",
        subcategory: subcategory ?? "",
        pages,
        notes:       searchParams.notes ?? "",
        color,
        symbol,
        year,
        textSize,
        iconSize,
        photos:      allPhotos,
        arrangement,
      }),
    });

    setSending(false);
    setSubmitted(true);

    if (contactType === "whatsapp") {
      const msg = encodeURIComponent(
        `Hi! I just placed an order on Zikra Book 📖\nBook: ${(subcategory ?? "").replace(/-/g, " ")} (${pages} pages)`
      );
      window.open(`https://wa.me/97455115749?text=${msg}`, "_blank");
    }
  }

  // ── Confirmation screen ───────────────────────────────────────────────────
  if (submitted) {
    return (
      <>
        <Nav />
        <main className="min-h-screen bg-cream-50 flex flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-6xl mb-6">✨</div>
            <h1 className="font-serif text-4xl md:text-5xl text-ink-900 mb-4">
              Your order is under preparation.
            </h1>
            <p className="text-ink-700 font-sans text-base max-w-md mx-auto mb-4">
              We have received your photos and layout. Our team will be in touch with you shortly to confirm the details.
            </p>
            <div className="bg-white border border-gold-400/20 rounded-2xl p-6 max-w-sm mx-auto mb-8 text-left">
              <p className="text-gold-500 text-xs tracking-[0.3em] uppercase font-sans mb-4">What happens next</p>
              <ul className="flex flex-col gap-3">
                {[
                  "Our team reviews your photos and layout",
                  "We contact you within 24 hours to confirm your order",
                  "You approve the final design",
                  "We print and deliver your book to your door 📦",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-sans text-ink-700">
                    <span className="text-gold-400 font-serif text-base leading-tight">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => router.push("/")}
              className="px-10 py-4 bg-gold-gradient text-cream-50 rounded-full text-sm tracking-widest font-medium hover:opacity-90 transition-opacity shadow-lg"
            >
              BACK TO HOME
            </button>
          </motion.div>
        </main>
      </>
    );
  }

  // ── Editor ────────────────────────────────────────────────────────────────
  // Build spread list: pairs of page indices [left, right]
  const spreads: [number, number][] = [];
  for (let i = 0; i < totalSides; i += 2) spreads.push([i, i + 1]);
  const currentSpreadIndex = Math.floor(spreadLeftPage / 2);

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-[#3a3a3a] pt-20 pb-0 flex flex-col">

        {/* ── Top toolbar ─────────────────────────────────────────────────── */}
        <div className="bg-[#2a2a2a] border-b border-white/10 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <p className="text-white/60 text-xs font-sans tracking-widest uppercase">Book Editor</p>
            <span className="text-white/20">·</span>
            <p className="text-white/80 text-xs font-sans">
              Pages {spreadLeftPage + 1}–{Math.min(spreadRightPage + 1, totalSides)}
              <span className="ml-2 text-gold-400">
                · {spreadActiveSide === 0 ? "Left" : "Right"} page selected
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-white/40 text-xs font-sans">{filledPages} of {totalSides} pages filled</span>
            <button
              onClick={() => setShowContact(true)}
              disabled={filledPages === 0}
              className="px-6 py-2 bg-gold-gradient text-cream-50 rounded-full text-xs tracking-widest font-medium hover:opacity-90 transition-opacity shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ORDER →
            </button>
          </div>
        </div>

        {/* ── Main area: canvas + right panel ─────────────────────────────── */}
        <div className="flex flex-1 overflow-hidden">

          {/* Canvas area */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-auto">

            {/* Spread canvas — full and prominent */}
            <div
              className="flex shadow-2xl overflow-hidden w-full"
              style={{ maxWidth: "900px", borderRadius: "4px", aspectRatio: "297/210" }}
            >
              {/* Left page */}
              <div
                className={`relative flex-1 overflow-hidden cursor-pointer transition-all duration-150 ${
                  spreadActiveSide === 0 ? "outline outline-2 outline-gold-400 outline-offset-[-2px] z-10" : ""
                }`}
                onClick={() => { setSpreadActiveSide(0); setSelectedSlot(0); }}
              >
                <PagePreview
                  layout={pageData[spreadLeftPage].layout}
                  photos={pageData[spreadLeftPage].photos}
                  borders={pageData[spreadLeftPage].borders}
                  selectedSlot={spreadActiveSide === 0 ? selectedSlot : -1}
                  onSelectSlot={(s) => { setSpreadActiveSide(0); setSelectedSlot(s); }}
                  onClearSlot={(s) => {
                    setSpreadActiveSide(0);
                    setPageData((prev) => {
                      const next  = [...prev];
                      const slots = [...next[spreadLeftPage].photos];
                      slots[s]    = null;
                      next[spreadLeftPage] = { ...next[spreadLeftPage], photos: slots };
                      return next;
                    });
                  }}
                />
              </div>

              {/* Spine */}
              <div
                className="flex-shrink-0 z-20 pointer-events-none"
                style={{
                  width: "16px",
                  background: "linear-gradient(to right, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.12) 60%, rgba(0,0,0,0.28) 100%)",
                }}
              />

              {/* Right page */}
              {spreadRightPage < totalSides ? (
                <div
                  className={`relative flex-1 overflow-hidden cursor-pointer transition-all duration-150 ${
                    spreadActiveSide === 1 ? "outline outline-2 outline-gold-400 outline-offset-[-2px] z-10" : ""
                  }`}
                  onClick={() => { setSpreadActiveSide(1); setSelectedSlot(0); }}
                >
                  <PagePreview
                    layout={pageData[spreadRightPage].layout}
                    photos={pageData[spreadRightPage].photos}
                    borders={pageData[spreadRightPage].borders}
                    selectedSlot={spreadActiveSide === 1 ? selectedSlot : -1}
                    onSelectSlot={(s) => { setSpreadActiveSide(1); setSelectedSlot(s); }}
                    onClearSlot={(s) => {
                      setSpreadActiveSide(1);
                      setPageData((prev) => {
                        const next  = [...prev];
                        const slots = [...next[spreadRightPage].photos];
                        slots[s]    = null;
                        next[spreadRightPage] = { ...next[spreadRightPage], photos: slots };
                        return next;
                      });
                    }}
                  />
                </div>
              ) : (
                <div className="flex-1 bg-white flex items-center justify-center">
                  <span className="text-ink-200 text-sm font-sans">back cover</span>
                </div>
              )}
            </div>

            <p className="text-white/30 text-[11px] font-sans mt-3">
              Click a page to select it, then click a photo from the panel on the right
            </p>
          </div>

          {/* ── Right panel: layout + photos + frame ──────────────────────── */}
          <div className="w-64 flex-shrink-0 bg-[#2a2a2a] border-l border-white/10 flex flex-col overflow-y-auto">

            {/* Layout presets */}
            <div className="p-4 border-b border-white/10">
              <p className="text-[10px] tracking-widest uppercase text-white/40 font-sans mb-3">Layout</p>
              <div className="grid grid-cols-2 gap-2">
                {(["1|1","2|2","2|1","1|2"] as const).map((preset) => {
                  const active = currentSpreadPreset() === preset;
                  return (
                    <button
                      key={preset}
                      onClick={() => setSpreadPreset(preset)}
                      className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all ${
                        active ? "border-gold-400 bg-gold-400/15" : "border-white/10 hover:border-white/30 bg-white/5"
                      }`}
                    >
                      <SpreadIcon preset={preset} active={active} />
                      <span className={`text-[9px] font-sans leading-tight text-center ${active ? "text-gold-400" : "text-white/50"}`}>
                        {preset === "1|1" && "1 per page"}
                        {preset === "2|2" && "2 per page"}
                        {preset === "2|1" && "2 left · 1 right"}
                        {preset === "1|2" && "1 left · 2 right"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Photo library */}
            <div className="p-4 border-b border-white/10 flex-1">
              <p className="text-[10px] tracking-widest uppercase text-white/40 font-sans mb-3">Your Photos</p>
              <div className="grid grid-cols-3 gap-1.5">
                {photos.map((photo) => (
                  <button
                    key={photo.id}
                    onClick={() => assignPhoto(photo)}
                    className="aspect-square rounded-lg overflow-hidden border border-white/10 hover:border-gold-400 transition-all relative group bg-white/5"
                    title="Click to place"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <span className="text-white text-xl opacity-0 group-hover:opacity-100 drop-shadow">+</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Frame control */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] tracking-widest uppercase text-white/40 font-sans">
                  Frame
                  {page.layout === "two-vertical" && (
                    <span className="ml-1 normal-case tracking-normal text-white/30">
                      · {selectedSlot === 0 ? "top" : "bottom"}
                    </span>
                  )}
                </p>
                <div className="flex rounded-lg overflow-hidden border border-white/20 text-[10px] font-sans">
                  <button
                    onClick={() => setBorder(selectedSlot, 0)}
                    className={`px-2.5 py-1.5 transition-all ${page.borders[selectedSlot] === 0 ? "bg-white text-ink-900" : "text-white/50 hover:bg-white/10"}`}
                  >
                    None
                  </button>
                  <button
                    onClick={() => { if (page.borders[selectedSlot] === 0) setBorder(selectedSlot, 8); }}
                    className={`px-2.5 py-1.5 transition-all border-l border-white/20 ${page.borders[selectedSlot] > 0 ? "bg-gold-gradient text-cream-50" : "text-white/50 hover:bg-white/10"}`}
                  >
                    Add
                  </button>
                </div>
              </div>
              {page.borders[selectedSlot] > 0 && (
                <div>
                  <div className="flex gap-1.5 mb-3">
                    {BORDER_PRESETS.filter((p) => p.value > 0).map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => setBorder(selectedSlot, preset.value)}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-sans transition-all ${
                          page.borders[selectedSlot] === preset.value
                            ? "bg-gold-gradient text-cream-50"
                            : "bg-white/10 text-white/60 hover:bg-white/20"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/30 text-[9px] font-sans">Thin</span>
                    <input
                      type="range" min={1} max={30} step={1}
                      value={page.borders[selectedSlot]}
                      onChange={(e) => setBorder(selectedSlot, Number(e.target.value))}
                      className="flex-1 accent-[#C49A5A] h-1 cursor-pointer"
                    />
                    <span className="text-white/30 text-[9px] font-sans">Thick</span>
                    <span className="text-white/60 text-[9px] font-sans w-7 text-right">{page.borders[selectedSlot]}px</span>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ── Bottom page strip ────────────────────────────────────────────── */}
        <div className="bg-[#222] border-t border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto">

            {/* Prev / Next */}
            <button
              onClick={() => { setCurrentPage((p) => Math.max(0, p - 2)); setSpreadActiveSide(0); setSelectedSlot(0); }}
              disabled={spreadLeftPage === 0}
              className="flex-shrink-0 w-7 h-7 rounded-full border border-white/20 text-white/50 hover:text-white hover:border-white/50 transition-all disabled:opacity-20 flex items-center justify-center text-sm"
            >‹</button>

            {/* Cover */}
            <div className="flex-shrink-0 flex flex-col items-center gap-1">
              <div className="w-14 h-10 rounded overflow-hidden border border-white/20" style={{ background: color }}>
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-white/60 text-[8px] font-sans">Cover</span>
                </div>
              </div>
              <span className="text-white/30 text-[9px] font-sans">Cover</span>
            </div>

            {/* Spread thumbnails */}
            {spreads.map(([left, right], si) => {
              const isActive = si === currentSpreadIndex;
              const leftPhoto  = pageData[left]?.photos[0];
              const rightPhoto = pageData[right]?.photos[0];
              return (
                <button
                  key={si}
                  onClick={() => { setCurrentPage(left); setSpreadActiveSide(0); setSelectedSlot(0); }}
                  className={`flex-shrink-0 flex flex-col items-center gap-1 transition-all`}
                >
                  {/* Spread thumbnail */}
                  <div
                    className={`flex overflow-hidden border rounded transition-all ${
                      isActive ? "border-gold-400 shadow-lg shadow-gold-400/20" : "border-white/10 hover:border-white/30"
                    }`}
                    style={{ width: "80px", height: "56px", borderRadius: "3px" }}
                  >
                    {/* Left half */}
                    <div className="flex-1 overflow-hidden bg-[#555]">
                      {leftPhoto ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={leftPhoto.url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-white/20 text-[8px]">+</span>
                        </div>
                      )}
                    </div>
                    {/* Spine */}
                    <div className="w-px bg-black/40 flex-shrink-0" />
                    {/* Right half */}
                    <div className="flex-1 overflow-hidden bg-[#555]">
                      {rightPhoto ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={rightPhoto.url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-white/20 text-[8px]">+</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className={`text-[9px] font-sans ${isActive ? "text-gold-400" : "text-white/30"}`}>
                    {left + 1}–{right + 1}
                  </span>
                </button>
              );
            })}

            {/* Back cover */}
            <div className="flex-shrink-0 flex flex-col items-center gap-1">
              <div className="w-14 h-10 rounded overflow-hidden border border-white/10 bg-[#555] flex items-center justify-center">
                <span className="text-white/20 text-[8px] font-sans">Back</span>
              </div>
              <span className="text-white/30 text-[9px] font-sans">Back</span>
            </div>

            {/* Next */}
            <button
              onClick={() => { setCurrentPage((p) => Math.min(totalSides - 1, p + 2)); setSpreadActiveSide(0); setSelectedSlot(0); }}
              disabled={spreadLeftPage >= totalSides - 2}
              className="flex-shrink-0 w-7 h-7 rounded-full border border-white/20 text-white/50 hover:text-white hover:border-white/50 transition-all disabled:opacity-20 flex items-center justify-center text-sm"
            >›</button>

          </div>
        </div>

        {/* ── Contact modal ─────────────────────────────────────────────── */}
          {showContact && !submitted && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
              >
                <h2 className="font-serif text-2xl text-ink-900 mb-2">Almost there! 🎉</h2>
                <p className="text-ink-700 font-sans text-sm mb-6">How should we send your confirmation?</p>

                {/* Name */}
                <div className="mb-4">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="First Name Last Name"
                    className="w-full border border-gold-400/30 rounded-lg px-4 py-3 text-sm font-sans text-ink-900 bg-cream-50 focus:outline-none focus:border-gold-400 transition-colors placeholder:text-ink-300"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-xs tracking-widest uppercase text-ink-700 font-sans mb-2">
                    Send confirmation via *
                  </label>
                  <div className="flex gap-3">
                    {(["email", "whatsapp"] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => { setContactType(type); setContact(""); }}
                        className={`flex-1 py-2.5 rounded-lg border text-sm font-sans transition-all ${
                          contactType === type
                            ? "border-gold-400 bg-gold-400/10 text-gold-600"
                            : "border-gold-400/20 text-ink-700 hover:border-gold-400/50"
                        }`}
                      >
                        {type === "email" ? "📧 Email" : "💬 WhatsApp"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-xs tracking-widest uppercase text-ink-700 font-sans mb-1.5">
                    {contactType === "email" ? "Email Address *" : "WhatsApp Number *"}
                  </label>
                  <input
                    type={contactType === "email" ? "email" : "tel"}
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder={contactType === "email" ? "you@example.com" : "+974 5555 0000"}
                    className="w-full border border-gold-400/30 rounded-lg px-4 py-3 text-sm font-sans text-ink-900 bg-cream-50 focus:outline-none focus:border-gold-400 transition-colors placeholder:text-ink-300"
                  />
                  {formError && <p className="text-red-400 text-xs mt-1">{formError}</p>}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowContact(false)}
                    className="px-5 py-3 text-sm text-ink-700 font-sans hover:text-gold-500 transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={sending}
                    className="flex-1 py-3 bg-gold-gradient text-cream-50 rounded-full text-sm tracking-widest font-medium hover:opacity-90 transition-opacity shadow-md disabled:opacity-50"
                  >
                    {sending ? "Sending..." : "CONFIRM ORDER →"}
                  </button>
                </div>
              </motion.div>
            </div>
          )}

      </main>
    </>
  );
}

// ── Spread layout icon ────────────────────────────────────────────────────────
function SpreadIcon({ preset, active }: { preset: "1|1"|"2|2"|"2|1"|"1|2"; active: boolean }) {
  const c = active ? "#C49A5A" : "#d4c5a9";
  const bg = "#f5f0e8";
  const left  = preset === "2|2" || preset === "2|1";
  const right = preset === "2|2" || preset === "1|2";
  return (
    <svg width="44" height="30" viewBox="0 0 44 30" fill="none">
      {/* Left page */}
      <rect x="1" y="1" width="19" height="28" rx="1" fill={bg} stroke={c} strokeWidth="1"/>
      {left ? (
        <>
          <rect x="2" y="2" width="17" height="13" rx="0.5" fill={c} opacity="0.5"/>
          <rect x="2" y="16" width="17" height="12" rx="0.5" fill={c} opacity="0.5"/>
        </>
      ) : (
        <rect x="2" y="2" width="17" height="26" rx="0.5" fill={c} opacity="0.5"/>
      )}
      {/* Spine */}
      <rect x="20.5" y="0" width="3" height="30" fill="#e8e0d0"/>
      {/* Right page */}
      <rect x="24" y="1" width="19" height="28" rx="1" fill={bg} stroke={c} strokeWidth="1"/>
      {right ? (
        <>
          <rect x="25" y="2" width="17" height="13" rx="0.5" fill={c} opacity="0.5"/>
          <rect x="25" y="16" width="17" height="12" rx="0.5" fill={c} opacity="0.5"/>
        </>
      ) : (
        <rect x="25" y="2" width="17" height="26" rx="0.5" fill={c} opacity="0.5"/>
      )}
    </svg>
  );
}

// ── Strip helpers ─────────────────────────────────────────────────────────────

// A non-editable thumbnail in the page strip (cover / blank endpapers)
function StripFixed({ label, tooltip, thumb }: { label: string; tooltip: string; thumb: React.ReactNode }) {
  return (
    <div
      title={tooltip}
      className="flex-shrink-0 overflow-hidden border-2 border-dashed border-gold-400/30 flex flex-col cursor-default opacity-80"
      style={{ width: "56px", borderRadius: "3px" }}
    >
      <div style={{ height: "64px" }} className="w-full overflow-hidden">
        {thumb}
      </div>
      <div className="w-full py-0.5 text-center bg-cream-50">
        <p className="text-[9px] font-sans font-medium leading-tight text-ink-400">{label}</p>
      </div>
    </div>
  );
}

// Mini cover thumbnail — shows the chosen cover colour + book title
function CoverThumb({ color, subcategory }: { color: string; subcategory: string }) {
  const title = subcategory.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center gap-0.5 px-1"
      style={{ background: color }}
    >
      <div className="w-4 h-0.5 rounded-full bg-white/60" />
      <p className="text-white text-[7px] font-serif text-center leading-tight line-clamp-2 drop-shadow">{title}</p>
      <div className="w-4 h-0.5 rounded-full bg-white/60" />
    </div>
  );
}

// Blank / white endpaper thumbnail
function BlankThumb() {
  return (
    <div className="w-full h-full bg-white flex items-center justify-center">
      <span className="text-ink-200 text-[9px] font-sans">blank</span>
    </div>
  );
}

// ── Page preview — photos bleed edge-to-edge ──────────────────────────────────
function PagePreview({
  layout, photos, borders, selectedSlot, onSelectSlot, onClearSlot,
}: {
  layout:       Layout;
  photos:       (UploadedPhoto | null)[];
  borders:      number[];
  selectedSlot: number; // -1 = no slot highlighted (inactive spread page)
  onSelectSlot: (slot: number) => void;
  onClearSlot:  (slot: number) => void;
}) {
  if (layout === "two") {
    return (
      <div className="absolute inset-0 flex gap-px">
        {[0, 1].map((slot) => (
          <PhotoSlot
            key={slot}
            photo={photos[slot]}
            border={borders[slot]}
            selected={selectedSlot === slot}
            onClick={() => onSelectSlot(slot)}
            onClear={() => onClearSlot(slot)}
            className="flex-1 h-full"
            edgeToEdge
          />
        ))}
      </div>
    );
  }

  if (layout === "two-vertical") {
    return (
      <div className="absolute inset-0 flex flex-col gap-px">
        {[0, 1].map((slot) => (
          <PhotoSlot
            key={slot}
            photo={photos[slot]}
            border={borders[slot]}
            selected={selectedSlot === slot}
            onClick={() => onSelectSlot(slot)}
            onClear={() => onClearSlot(slot)}
            className="flex-1 w-full"
            edgeToEdge
          />
        ))}
      </div>
    );
  }

  const wrapperClass: Record<Layout, string> = {
    full:           "absolute inset-0",
    left:           "absolute left-0 top-0 bottom-0 right-1/2",
    right:          "absolute right-0 top-0 bottom-0 left-1/2",
    top:            "absolute top-0 left-0 right-0 bottom-1/2",
    bottom:         "absolute bottom-0 left-0 right-0 top-1/2",
    two:            "absolute inset-0",
    "two-vertical": "absolute inset-0",
  };

  return (
    <PhotoSlot
      photo={photos[0]}
      border={borders[0]}
      selected={selectedSlot === 0}
      onClick={() => onSelectSlot(0)}
      onClear={() => onClearSlot(0)}
      className={wrapperClass[layout]}
      edgeToEdge={layout === "full"}
    />
  );
}

// ── Photo slot ────────────────────────────────────────────────────────────────
function PhotoSlot({
  photo, border = 0, selected, onClick, onClear, className, edgeToEdge = false,
}: {
  photo:       UploadedPhoto | null;
  border?:     number;
  selected:    boolean; // -1 treated as false (inactive page in spread)
  onClick:     () => void;
  onClear:     () => void;
  className:   string;
  edgeToEdge?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`overflow-hidden transition-all duration-150 relative group ${
        edgeToEdge ? "rounded-none" : "rounded-sm"
      } ${
        selected && !photo
          ? "ring-2 ring-gold-400 ring-inset"
          : !photo
          ? "ring-1 ring-dashed ring-gold-400/40 ring-inset hover:ring-gold-400/70"
          : ""
      } ${className}`}
    >
      {photo ? (
        <>
          {/* Padding creates the white border — image genuinely shrinks inside the white frame */}
          <div
            className="w-full h-full"
            style={{ padding: border > 0 ? `${border}px` : undefined, background: border > 0 ? "white" : undefined }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.url} alt="" className="w-full h-full object-cover" />
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            className="absolute top-2 right-2 w-6 h-6 bg-black/60 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10"
          >
            ✕
          </button>
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-cream-100/80">
          <span className="text-xl mb-1">📷</span>
          <span className="text-ink-400 text-[10px] font-sans">
            {selected ? "Click a photo →" : "Click to select"}
          </span>
        </div>
      )}
    </button>
  );
}
