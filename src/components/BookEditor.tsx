"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Nav from "@/components/Nav";
import { useRouter } from "next/navigation";
import type { UploadedPhoto } from "@/types/book";

// ── Types ─────────────────────────────────────────────────────────────────────
type Layout = "full" | "left" | "right" | "top" | "bottom" | "two";

const LAYOUTS: { id: Layout; label: string; icon: string }[] = [
  { id: "full",   label: "Full page",   icon: "⬛" },
  { id: "left",   label: "Left side",   icon: "◧"  },
  { id: "right",  label: "Right side",  icon: "◨"  },
  { id: "top",    label: "Top half",    icon: "⬒"  },
  { id: "bottom", label: "Bottom half", icon: "⬓"  },
  { id: "two",    label: "Two photos",  icon: "▪▪" },
];

type PageData = {
  layout: Layout;
  photos: (UploadedPhoto | null)[];
};

type Props = {
  photos:       UploadedPhoto[];
  pages:        number;
  category:     string;
  subcategory?: string;
  searchParams: Record<string, string>;
};

// ── Main component ────────────────────────────────────────────────────────────
export default function BookEditor({ photos, pages, category, subcategory, searchParams }: Props) {
  const router = useRouter();

  const totalSides = pages * 2; // each page has a front and a back

  const [pageData, setPageData] = useState<PageData[]>(
    Array.from({ length: totalSides }, () => ({ layout: "full", photos: [null, null] }))
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [showContact, setShowContact] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [contactType, setContactType] = useState<"email" | "whatsapp">("email");
  const [contact, setContact] = useState("");
  const [formError, setFormError] = useState("");

  const page        = pageData[currentPage];
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
      next[currentPage] = { layout, photos: [null, null] };
      return next;
    });
    setSelectedSlot(0);
  }

  // Auto-detect orientation and set layout on first photo placed
  function assignPhoto(photo: UploadedPhoto) {
    const img = new window.Image();
    img.onload = () => {
      const isLandscape = img.naturalWidth > img.naturalHeight;
      setPageData((prev) => {
        const next    = [...prev];
        const cur     = next[currentPage];
        const slots   = [...cur.photos];
        const isEmpty = !cur.photos[0] && !cur.photos[1];

        if (isEmpty) {
          // Auto layout: landscape → two photos side by side, portrait → full page
          const autoLayout: Layout = isLandscape ? "two" : "full";
          slots[0] = photo;
          next[currentPage] = { layout: autoLayout, photos: slots };
          // Auto-advance to slot 1 so next click fills the second slot
          if (autoLayout === "two") setSelectedSlot(1);
        } else {
          slots[selectedSlot] = photo;
          next[currentPage] = { ...cur, photos: slots };
          // If in two-photo layout and we just filled slot 0, advance to slot 1
          if (cur.layout === "two" && selectedSlot === 0) setSelectedSlot(1);
        }
        return next;
      });
    };
    img.src = photo.url;
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

  async function handleSubmit() {
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
    await fetch("/api/order", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        name: "Customer", contact, contactType,
        category:    category    ?? "",
        subcategory: subcategory ?? "",
        pages,
        notes:  searchParams.notes ?? "",
        photos: allPhotos,
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

              {/* Layout picker */}
              <div className="flex flex-wrap gap-1.5 mb-3">
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

              {/* Page canvas — photo bleeds to edge, book proportions */}
              <div
                className="relative bg-cream-100 overflow-hidden mx-auto shadow-lg"
                style={{ aspectRatio: "3/4", maxWidth: "340px", borderRadius: "3px" }}
              >
                <PagePreview
                  layout={page.layout}
                  photos={page.photos}
                  selectedSlot={selectedSlot}
                  onSelectSlot={setSelectedSlot}
                  onClearSlot={clearSlot}
                />
              </div>

              <p className="text-center text-ink-400 text-xs font-sans mt-3">
                {page.layout === "two"
                  ? `Placing in ${selectedSlot === 0 ? "left" : "right"} slot — click the other side to switch`
                  : "Click a photo from the left to place it on this page"}
              </p>
            </div>

          </div>

          {/* ── Page strip — horizontal scroll ───────────────────────────── */}
          <div className="mt-6 border-t border-gold-400/10 pt-4">
            <p className="text-xs tracking-widest uppercase text-ink-700 font-sans mb-3">Pages</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
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
                    {/* Thumbnail */}
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
                    {/* Label */}
                    <div className={`w-full py-0.5 text-center ${i === currentPage ? "bg-gold-400" : "bg-cream-100"}`}>
                      <p className={`text-[9px] font-sans font-medium leading-tight ${i === currentPage ? "text-white" : "text-ink-500"}`}>
                        P{pageNum} {side === "Front" ? "▲" : "▼"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Bottom nav ────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between mt-5 flex-wrap gap-4">
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
                disabled={currentPage === totalSides - 1}
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

// ── Page preview — photos bleed edge-to-edge ──────────────────────────────────
function PagePreview({
  layout, photos, selectedSlot, onSelectSlot, onClearSlot,
}: {
  layout:       Layout;
  photos:       (UploadedPhoto | null)[];
  selectedSlot: number;
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

  // Positions for each layout — all edge-to-edge, no gap
  const wrapperClass: Record<Layout, string> = {
    full:   "absolute inset-0",
    left:   "absolute left-0 top-0 bottom-0 right-1/2",
    right:  "absolute right-0 top-0 bottom-0 left-1/2",
    top:    "absolute top-0 left-0 right-0 bottom-1/2",
    bottom: "absolute bottom-0 left-0 right-0 top-1/2",
    two:    "absolute inset-0",
  };

  return (
    <PhotoSlot
      photo={photos[0]}
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
  photo, selected, onClick, onClear, className, edgeToEdge = false,
}: {
  photo:       UploadedPhoto | null;
  selected:    boolean;
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo.url} alt="" className="w-full h-full object-cover" />
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
