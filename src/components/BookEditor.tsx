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
  const [spreadView, setSpreadView] = useState(false);
  // In spread view: which of the two facing pages is the active editing target (0=left, 1=right)
  const [spreadActiveSide, setSpreadActiveSide] = useState<0 | 1>(0);
  const [showContact, setShowContact] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [name, setName] = useState("");
  const [contactType, setContactType] = useState<"email" | "whatsapp">("email");
  const [contact, setContact] = useState("");
  const [formError, setFormError] = useState("");

  // In spread view, snap currentPage to an even index (left page of a spread)
  const spreadLeftPage  = spreadView ? (currentPage % 2 === 0 ? currentPage : currentPage - 1) : currentPage;
  const spreadRightPage = spreadLeftPage + 1;
  // Which page are we actually editing? In single view = currentPage; in spread = the active side
  const editingPage = spreadView ? (spreadActiveSide === 0 ? spreadLeftPage : spreadRightPage) : currentPage;

  const page        = pageData[editingPage];
  const filledPages = pageData.filter((p) => p.photos[0] !== null).length;

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
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-cream-50 pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="text-center mb-6">
            <p className="text-gold-500 text-xs tracking-[0.35em] uppercase mb-2 font-sans">Book Editor</p>
            <h1 className="font-serif text-3xl text-ink-900">Arrange your photos</h1>
            <p className="text-ink-700 font-sans text-sm mt-1">
              {getSideLabel(currentPage).full} · {filledPages} of {totalSides} sides filled
            </p>
          </div>

          <div className="flex gap-4 items-start">

            {/* ── Left: photo library ───────────────────────────────────── */}
            <div className="w-48 flex-shrink-0">
              <p className="text-xs tracking-widest uppercase text-ink-700 font-sans mb-3">Your Photos</p>
              <div className="bg-white rounded-xl border border-gold-400/20 p-2 max-h-[520px] overflow-y-auto">
                <div className="grid grid-cols-2 gap-2">
                  {photos.map((photo) => (
                    <button
                      key={photo.id}
                      onClick={() => assignPhoto(photo)}
                      className="aspect-square rounded-lg overflow-hidden border-2 border-cream-200 hover:border-gold-400 transition-all relative group bg-cream-100"
                      title="Click to place on page"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <span className="text-white text-2xl opacity-0 group-hover:opacity-100 drop-shadow font-light">+</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-ink-400 text-[10px] font-sans mt-2 leading-snug">
                Portrait → full page · Landscape → 2 per page
              </p>
            </div>

            {/* ── Centre: canvas ────────────────────────────────────────── */}
            <div className="flex-1 min-w-0">

              {/* Layout picker + spread toggle */}
              <div className="flex flex-wrap gap-1.5 mb-3 items-center">
                {LAYOUTS.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLayout(l.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-sans border transition-all ${
                      page.layout === l.id
                        ? "bg-gold-gradient text-cream-50 border-transparent"
                        : "border-gold-400/30 text-ink-700 hover:border-gold-400"
                    }`}
                  >
                    {l.icon} {l.label}
                  </button>
                ))}
                {/* Divider */}
                <span className="text-gold-400/40 text-xs select-none">|</span>
                {/* Spread view toggle */}
                <button
                  onClick={() => {
                    setSpreadView((v) => !v);
                    setSpreadActiveSide(0);
                    setSelectedSlot(0);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-sans border transition-all ${
                    spreadView
                      ? "bg-gold-gradient text-cream-50 border-transparent"
                      : "border-gold-400/30 text-ink-700 hover:border-gold-400"
                  }`}
                >
                  📖 Two-page spread
                </button>
              </div>

              {spreadView ? (
                /* ── Spread canvas ─────────────────────────────────────── */
                <div>
                  {/* Spread label */}
                  <p className="text-center text-ink-500 text-xs font-sans mb-2">
                    {getSideLabel(spreadLeftPage).full} &amp; {spreadRightPage < totalSides ? getSideLabel(spreadRightPage).full : "—"}
                    <span className="ml-2 text-gold-500">
                      · Editing {spreadActiveSide === 0 ? "left" : "right"} page
                    </span>
                  </p>

                  {/* Two pages side by side with spine shadow */}
                  <div
                    className="flex mx-auto shadow-xl overflow-hidden"
                    style={{ maxWidth: "560px", borderRadius: "3px", aspectRatio: "3/2" }}
                  >
                    {/* Left page */}
                    <div
                      className={`relative flex-1 overflow-hidden cursor-pointer transition-all duration-150 ${
                        spreadActiveSide === 0 ? "ring-2 ring-gold-400 ring-inset z-10" : "opacity-80"
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
                            slots[s] = null;
                            next[spreadLeftPage] = { ...next[spreadLeftPage], photos: slots };
                            return next;
                          });
                        }}
                      />
                      {/* Left page label */}
                      <div className="absolute bottom-1 left-0 right-0 text-center pointer-events-none">
                        <span className="text-[8px] font-sans text-white/60 drop-shadow">LEFT</span>
                      </div>
                    </div>

                    {/* Spine shadow */}
                    <div
                      className="flex-shrink-0 relative z-20 pointer-events-none"
                      style={{
                        width: "14px",
                        background: "linear-gradient(to right, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.04) 40%, rgba(0,0,0,0.10) 60%, rgba(0,0,0,0.22) 100%)",
                        boxShadow: "inset -2px 0 4px rgba(0,0,0,0.08), inset 2px 0 4px rgba(0,0,0,0.08)",
                      }}
                    />

                    {/* Right page */}
                    {spreadRightPage < totalSides ? (
                      <div
                        className={`relative flex-1 overflow-hidden cursor-pointer transition-all duration-150 ${
                          spreadActiveSide === 1 ? "ring-2 ring-gold-400 ring-inset z-10" : "opacity-80"
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
                              slots[s] = null;
                              next[spreadRightPage] = { ...next[spreadRightPage], photos: slots };
                              return next;
                            });
                          }}
                        />
                        <div className="absolute bottom-1 left-0 right-0 text-center pointer-events-none">
                          <span className="text-[8px] font-sans text-white/60 drop-shadow">RIGHT</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 bg-white flex items-center justify-center">
                        <span className="text-ink-200 text-xs font-sans">back cover</span>
                      </div>
                    )}
                  </div>

                  <p className="text-center text-ink-400 text-xs font-sans mt-2">
                    Click a page to select it, then click a photo from the left to place it
                  </p>
                </div>
              ) : (
                /* ── Single page canvas ────────────────────────────────── */
                <div>
                  <div
                    className="relative bg-cream-100 overflow-hidden mx-auto shadow-lg"
                    style={{ aspectRatio: "3/4", maxWidth: "340px", borderRadius: "3px" }}
                  >
                    <PagePreview
                      layout={page.layout}
                      photos={page.photos}
                      borders={page.borders}
                      selectedSlot={selectedSlot}
                      onSelectSlot={setSelectedSlot}
                      onClearSlot={clearSlot}
                    />
                  </div>
                  <p className="text-center text-ink-400 text-xs font-sans mt-3">
                    {page.layout === "two"
                      ? `Placing in ${selectedSlot === 0 ? "left" : "right"} slot — click the other side to switch`
                      : page.layout === "two-vertical"
                      ? `Placing in ${selectedSlot === 0 ? "top" : "bottom"} slot — click the other side to switch`
                      : "Click a photo from the left to place it on this page"}
                  </p>
                </div>
              )}

              {/* ── Border control ──────────────────────────────────────── */}
              <div className="mt-4 bg-white border border-gold-400/20 rounded-xl p-4">
                {/* Header row */}
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs tracking-widest uppercase text-ink-700 font-sans">
                    Photo Frame
                    {spreadView && (
                      <span className="ml-1 normal-case tracking-normal text-gold-500">
                        — {spreadActiveSide === 0 ? "Left" : "Right"} page
                      </span>
                    )}
                    {(page.layout === "two" || page.layout === "two-vertical") && (
                      <span className="ml-1 normal-case tracking-normal text-ink-400">
                        · {selectedSlot === 0
                          ? (page.layout === "two" ? "left photo" : "top photo")
                          : (page.layout === "two" ? "right photo" : "bottom photo")}
                      </span>
                    )}
                  </p>

                  {/* No frame / Frame toggle */}
                  <div className="flex rounded-lg overflow-hidden border border-gold-400/30 text-xs font-sans">
                    <button
                      onClick={() => setBorder(selectedSlot, 0)}
                      className={`px-3 py-1.5 transition-all ${
                        page.borders[selectedSlot] === 0
                          ? "bg-ink-900 text-white"
                          : "text-ink-600 hover:bg-cream-100"
                      }`}
                    >
                      No frame
                    </button>
                    <button
                      onClick={() => { if (page.borders[selectedSlot] === 0) setBorder(selectedSlot, 8); }}
                      className={`px-3 py-1.5 transition-all border-l border-gold-400/30 ${
                        page.borders[selectedSlot] > 0
                          ? "bg-gold-gradient text-cream-50"
                          : "text-ink-600 hover:bg-cream-100"
                      }`}
                    >
                      Add frame
                    </button>
                  </div>
                </div>

                {/* Thickness controls — only visible when frame is on */}
                {page.borders[selectedSlot] > 0 && (
                  <div className="pt-3 border-t border-cream-200">
                    <p className="text-[10px] font-sans text-ink-500 mb-2">Frame thickness</p>

                    {/* Quick presets */}
                    <div className="flex gap-2 mb-3">
                      {BORDER_PRESETS.filter((p) => p.value > 0).map((preset) => (
                        <button
                          key={preset.label}
                          onClick={() => setBorder(selectedSlot, preset.value)}
                          className={`flex-1 py-1.5 rounded-lg border text-xs font-sans transition-all ${
                            page.borders[selectedSlot] === preset.value
                              ? "bg-gold-gradient text-cream-50 border-transparent"
                              : "border-gold-400/30 text-ink-700 hover:border-gold-400"
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    {/* Fine slider */}
                    <div className="flex items-center gap-3">
                      <span className="text-ink-400 text-[10px] font-sans">Thin</span>
                      <input
                        type="range" min={1} max={30} step={1}
                        value={page.borders[selectedSlot]}
                        onChange={(e) => setBorder(selectedSlot, Number(e.target.value))}
                        className="flex-1 accent-[#C49A5A] h-1.5 cursor-pointer"
                      />
                      <span className="text-ink-400 text-[10px] font-sans">Thick</span>
                      <span className="text-ink-700 text-[10px] font-sans w-8 text-right font-medium">
                        {page.borders[selectedSlot]}px
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* ── Page strip — horizontal scroll ───────────────────────────── */}
          <div className="mt-6 border-t border-gold-400/10 pt-4">
            <p className="text-xs tracking-widest uppercase text-ink-700 font-sans mb-3">Full Book Preview</p>
            <div className="flex gap-2 overflow-x-auto pb-2 items-end">

              {/* Front cover — fixed, not editable */}
              <StripFixed
                label="Cover"
                tooltip="Your custom cover design"
                thumb={<CoverThumb color={color} subcategory={subcategory ?? ""} />}
              />

              {/* Inside front cover — always blank */}
              <StripFixed
                label="Pg 1 ▲"
                tooltip="Inside front cover — always blank white"
                thumb={<BlankThumb />}
              />

              {/* Interior photo pages */}
              {pageData.map((p, i) => {
                const { pageNum, side } = getSideLabel(i);
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`flex-shrink-0 overflow-hidden border-2 transition-all flex flex-col ${
                      i === currentPage
                        ? "border-gold-400 shadow-md"
                        : "border-gold-400/10 hover:border-gold-400/40"
                    }`}
                    style={{ width: "56px", borderRadius: "3px" }}
                  >
                    <div style={{ height: "64px" }} className="w-full overflow-hidden">
                      {p.photos[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.photos[0].url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-cream-100 flex items-center justify-center">
                          <span className="text-ink-300 text-[10px] font-sans">📷</span>
                        </div>
                      )}
                    </div>
                    <div className={`w-full py-0.5 text-center ${i === currentPage ? "bg-gold-400" : "bg-cream-100"}`}>
                      <p className={`text-[9px] font-sans font-medium leading-tight ${i === currentPage ? "text-white" : "text-ink-500"}`}>
                        P{pageNum} {side === "Front" ? "▲" : "▼"}
                      </p>
                    </div>
                  </button>
                );
              })}

              {/* Inside back cover — always blank */}
              <StripFixed
                label={`Pg ${pages + 1} ▼`}
                tooltip="Inside back cover — always blank white"
                thumb={<BlankThumb />}
              />

              {/* Back cover — always blank */}
              <StripFixed
                label="Back"
                tooltip="Back cover — always blank white"
                thumb={<BlankThumb />}
              />

            </div>

            {/* Legend */}
            <div className="flex gap-4 mt-2">
              <span className="flex items-center gap-1.5 text-[10px] font-sans text-ink-400">
                <span className="w-3 h-3 rounded-sm border border-gold-400/50 inline-block" style={{ background: color }} />
                Your cover design
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-sans text-ink-400">
                <span className="w-3 h-3 rounded-sm border border-dashed border-ink-300 inline-block bg-white" />
                Blank (white page)
              </span>
            </div>
          </div>

          {/* ── Bottom nav ────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between mt-5 flex-wrap gap-4">
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setCurrentPage((p) => Math.max(0, spreadView ? p - 2 : p - 1));
                  setSpreadActiveSide(0); setSelectedSlot(0);
                }}
                disabled={currentPage === 0}
                className="px-5 py-2.5 border border-gold-400/30 rounded-full text-sm font-sans text-ink-700 hover:border-gold-400 transition-colors disabled:opacity-30"
              >
                ← Prev
              </button>
              <button
                onClick={() => {
                  setCurrentPage((p) => Math.min(totalSides - 1, spreadView ? p + 2 : p + 1));
                  setSpreadActiveSide(0); setSelectedSlot(0);
                }}
                disabled={spreadView ? spreadLeftPage >= totalSides - 2 : currentPage === totalSides - 1}
                className="px-5 py-2.5 border border-gold-400/30 rounded-full text-sm font-sans text-ink-700 hover:border-gold-400 transition-colors disabled:opacity-30"
              >
                Next →
              </button>
            </div>

            <button
              onClick={() => setShowContact(true)}
              disabled={filledPages === 0}
              className="px-10 py-3.5 bg-gold-gradient text-cream-50 rounded-full text-sm tracking-widest font-medium hover:opacity-90 transition-opacity shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
            >
              SUBMIT MY BOOK ORDER →
            </button>
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

        </div>
      </main>
    </>
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
