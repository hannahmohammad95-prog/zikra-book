"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Nav from "@/components/Nav";
import { useRouter } from "next/navigation";
import type { UploadedPhoto } from "@/app/create/[category]/upload/page";

// ── Layout options per page ───────────────────────────────────────────────────
type Layout = "full" | "left" | "right" | "top" | "bottom" | "two";

const LAYOUTS: { id: Layout; label: string; icon: string }[] = [
  { id: "full",   label: "Full page",    icon: "⬛" },
  { id: "left",   label: "Left side",    icon: "◧" },
  { id: "right",  label: "Right side",   icon: "◨" },
  { id: "top",    label: "Top half",     icon: "⬒" },
  { id: "bottom", label: "Bottom half",  icon: "⬓" },
  { id: "two",    label: "Two photos",   icon: "▪▪" },
];

type PageData = {
  layout:   Layout;
  photos:   (UploadedPhoto | null)[];  // up to 2 slots
};

type Props = {
  photos:       UploadedPhoto[];
  pages:        number;
  category:     string;
  searchParams: Record<string, string>;
};

export default function BookEditor({ photos, pages, category, searchParams }: Props) {
  const router = useRouter();

  // Initialise all pages with "full" layout and no photo assigned
  const [pageData, setPageData] = useState<PageData[]>(
    Array.from({ length: pages }, () => ({ layout: "full", photos: [null, null] }))
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);

  const page = pageData[currentPage];

  function setLayout(layout: Layout) {
    setPageData((prev) => {
      const next = [...prev];
      next[currentPage] = { ...next[currentPage], layout, photos: [null, null] };
      return next;
    });
    setSelectedSlot(0);
  }

  function assignPhoto(photo: UploadedPhoto) {
    setPageData((prev) => {
      const next      = [...prev];
      const slots     = [...next[currentPage].photos];
      slots[selectedSlot] = photo;
      next[currentPage]   = { ...next[currentPage], photos: slots };
      return next;
    });
  }

  function clearSlot(slot: number) {
    setPageData((prev) => {
      const next  = [...prev];
      const slots = [...next[currentPage].photos];
      slots[slot] = null;
      next[currentPage] = { ...next[currentPage], photos: slots };
      return next;
    });
  }

  function handleSubmit() {
    setSubmitted(true);
    // In a future step we'll send this to an API / email
  }

  const filledPages = pageData.filter((p) => p.photos[0] !== null).length;

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
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="font-serif text-4xl md:text-5xl text-ink-900 mb-4">
              Your book is on its way!
            </h1>
            <p className="text-ink-700 font-sans text-base max-w-md mx-auto mb-2">
              Thank you, <strong>{searchParams.name}</strong>! We have received your layout and photos.
            </p>
            <p className="text-ink-700 font-sans text-sm max-w-md mx-auto mb-8">
              Our team will review your book and reach out to you at <strong>{searchParams.email}</strong> or <strong>{searchParams.phone}</strong> within 24 hours.
            </p>
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

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-cream-50 pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="text-center mb-6">
            <p className="text-gold-500 text-xs tracking-[0.35em] uppercase mb-2 font-sans">
              Book Editor
            </p>
            <h1 className="font-serif text-3xl text-ink-900">
              Arrange your photos
            </h1>
            <p className="text-ink-700 font-sans text-sm mt-1">
              Page {currentPage + 1} of {pages} · {filledPages} page{filledPages !== 1 ? "s" : ""} filled
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">

            {/* ── Left panel: photo library ─────────────────────────────── */}
            <div className="lg:w-56 flex-shrink-0">
              <p className="text-xs tracking-widest uppercase text-ink-700 font-sans mb-3">
                Your Photos
              </p>
              <div className="grid grid-cols-3 lg:grid-cols-2 gap-2">
                {photos.map((photo) => (
                  <button
                    key={photo.id}
                    onClick={() => assignPhoto(photo)}
                    className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-gold-400 transition-all duration-150 relative group"
                    title="Click to place on selected slot"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gold-400/0 group-hover:bg-gold-400/20 transition-colors flex items-center justify-center">
                      <span className="text-white text-lg opacity-0 group-hover:opacity-100">+</span>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-ink-400 text-[11px] font-sans mt-3 leading-snug">
                Click a photo to place it on the highlighted slot
              </p>
            </div>

            {/* ── Centre: page preview ──────────────────────────────────── */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl border border-gold-400/20 p-4 shadow-sm">

                {/* Layout selector */}
                <div className="flex flex-wrap gap-2 mb-4">
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
                </div>

                {/* Page canvas */}
                <div
                  className="relative bg-cream-50 rounded-xl overflow-hidden mx-auto border border-gold-400/10"
                  style={{ aspectRatio: "3/4", maxWidth: "360px" }}
                >
                  <PagePreview
                    layout={page.layout}
                    photos={page.photos}
                    selectedSlot={selectedSlot}
                    onSelectSlot={setSelectedSlot}
                    onClearSlot={clearSlot}
                  />
                </div>

                {/* Slot hint */}
                <p className="text-center text-ink-400 text-xs font-sans mt-3">
                  {page.layout === "two"
                    ? `Slot ${selectedSlot + 1} selected — click a photo from the panel to place it`
                    : "Click a photo from the left panel to place it on this page"}
                </p>
              </div>
            </div>

            {/* ── Right panel: page navigation ─────────────────────────── */}
            <div className="lg:w-40 flex-shrink-0">
              <p className="text-xs tracking-widest uppercase text-ink-700 font-sans mb-3">
                Pages
              </p>
              <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                {pageData.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`flex-shrink-0 rounded-lg border-2 overflow-hidden transition-all ${
                      i === currentPage
                        ? "border-gold-400 shadow-md"
                        : "border-transparent hover:border-gold-400/40"
                    }`}
                    style={{ width: "60px", height: "80px" }}
                  >
                    {p.photos[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.photos[0].url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-cream-100 flex items-center justify-center">
                        <span className="text-ink-300 text-xs font-sans">{i + 1}</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Page navigation + submit */}
          <div className="flex items-center justify-between mt-8 flex-wrap gap-4">
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="px-5 py-2.5 border border-gold-400/30 rounded-full text-sm font-sans text-ink-700 hover:border-gold-400 transition-colors disabled:opacity-30"
              >
                ← Prev
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(pages - 1, p + 1))}
                disabled={currentPage === pages - 1}
                className="px-5 py-2.5 border border-gold-400/30 rounded-full text-sm font-sans text-ink-700 hover:border-gold-400 transition-colors disabled:opacity-30"
              >
                Next →
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={filledPages === 0}
              className="px-10 py-3.5 bg-gold-gradient text-cream-50 rounded-full text-sm tracking-widest font-medium hover:opacity-90 transition-opacity shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
            >
              SUBMIT MY BOOK ORDER →
            </button>
          </div>

        </div>
      </main>
    </>
  );
}

// ── Page preview — renders the layout with photo slots ────────────────────────
function PagePreview({
  layout,
  photos,
  selectedSlot,
  onSelectSlot,
  onClearSlot,
}: {
  layout:       Layout;
  photos:       (UploadedPhoto | null)[];
  selectedSlot: number;
  onSelectSlot: (slot: number) => void;
  onClearSlot:  (slot: number) => void;
}) {
  if (layout === "two") {
    return (
      <div className="absolute inset-0 flex gap-1 p-1">
        {[0, 1].map((slot) => (
          <PhotoSlot
            key={slot}
            photo={photos[slot]}
            selected={selectedSlot === slot}
            onClick={() => onSelectSlot(slot)}
            onClear={() => onClearSlot(slot)}
            className="flex-1 h-full"
          />
        ))}
      </div>
    );
  }

  const wrapperClass: Record<Layout, string> = {
    full:   "absolute inset-1",
    left:   "absolute left-1 top-1 bottom-1 right-1/2 mr-0.5",
    right:  "absolute right-1 top-1 bottom-1 left-1/2 ml-0.5",
    top:    "absolute top-1 left-1 right-1 bottom-1/2 mb-0.5",
    bottom: "absolute bottom-1 left-1 right-1 top-1/2 mt-0.5",
    two:    "absolute inset-1",
  };

  return (
    <PhotoSlot
      photo={photos[0]}
      selected={selectedSlot === 0}
      onClick={() => onSelectSlot(0)}
      onClear={() => onClearSlot(0)}
      className={wrapperClass[layout]}
    />
  );
}

// ── A single droppable photo slot ─────────────────────────────────────────────
function PhotoSlot({
  photo,
  selected,
  onClick,
  onClear,
  className,
}: {
  photo:     UploadedPhoto | null;
  selected:  boolean;
  onClick:   () => void;
  onClear:   () => void;
  className: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg overflow-hidden border-2 transition-all duration-150 ${
        selected ? "border-gold-400 shadow-lg" : "border-dashed border-gold-400/30 hover:border-gold-400/60"
      } ${className} relative group`}
    >
      {photo ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo.url} alt="" className="w-full h-full object-cover" />
          <button
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10"
          >
            ✕
          </button>
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-cream-100">
          <span className="text-2xl mb-1">📷</span>
          <span className="text-ink-400 text-[10px] font-sans">
            {selected ? "Click a photo →" : "Click to select"}
          </span>
        </div>
      )}
    </button>
  );
}
