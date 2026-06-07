"use client";

import { useState, useCallback, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Nav from "@/components/Nav";
import BookEditor from "@/components/BookEditor";
import type { UploadedPhoto } from "@/types/book";

function toTitle(slug: string) {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

type PendingPhoto = {
  tempId:     string;
  name:       string;
  previewUrl: string;
  progress:   number;
  error:      boolean;
};

type AnalysisStep = {
  label:  string;
  done:   boolean;
  detail: string;
};

// ── Client-side AI helpers ────────────────────────────────────────────────────

// Sharpness score using pixel variance on a 100×100 canvas (higher = sharper)
async function sharpnessScore(file: File): Promise<number> {
  const url = URL.createObjectURL(file);
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const size = 100;
      const canvas = document.createElement("canvas");
      canvas.width = size; canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) { URL.revokeObjectURL(url); resolve(50); return; }
      ctx.drawImage(img, 0, 0, size, size);
      const { data } = ctx.getImageData(0, 0, size, size);
      let sum = 0, sumSq = 0;
      const n = size * size;
      for (let i = 0; i < data.length; i += 4) {
        const g = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
        sum += g; sumSq += g * g;
      }
      URL.revokeObjectURL(url);
      resolve(sumSq / n - (sum / n) ** 2);
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(50); };
    img.src = url;
  });
}

type ScoredFile = {
  file:      File;
  date:      number; // ms
  score:     number; // sharpness
  duplicate: boolean;
};

async function analyseFiles(
  files: File[],
  onStep: (i: number, detail: string) => void,
): Promise<{ selected: File[]; skippedDupes: number; skippedBlurry: number }> {
  // Step 0 – compute sharpness for all files
  onStep(0, `Scanning ${files.length} photos…`);
  const scored: ScoredFile[] = await Promise.all(
    files.map(async (f) => ({
      file:      f,
      date:      f.lastModified,
      score:     await sharpnessScore(f),
      duplicate: false,
    }))
  );

  // Step 1 – sort by date taken
  onStep(1, `Sorting ${files.length} photos by date…`);
  scored.sort((a, b) => a.date - b.date);

  // Step 2 – mark duplicates (same timestamp ±3 s AND size within 15%)
  onStep(2, "Checking for duplicates…");
  for (let i = 1; i < scored.length; i++) {
    const a = scored[i - 1];
    const b = scored[i];
    const timeDiff = Math.abs(a.date - b.date);
    const sizeDiff = Math.abs(a.file.size - b.file.size) / Math.max(a.file.size, b.file.size);
    if (timeDiff < 3000 && sizeDiff < 0.15) {
      // Keep the sharper one
      if (a.score >= b.score) b.duplicate = true;
      else a.duplicate = true;
    }
  }
  const dupes = scored.filter((s) => s.duplicate).length;

  // Step 3 – mark blurry (bottom 15% of sharpness, only among non-dupes)
  onStep(3, "Filtering out blurry shots…");
  const nonDupes = scored.filter((s) => !s.duplicate);
  const scores   = nonDupes.map((s) => s.score).sort((a, b) => a - b);
  const threshold = scores[Math.floor(scores.length * 0.15)] ?? 0;
  let blurry = 0;
  for (const s of nonDupes) {
    if (s.score < threshold) { s.duplicate = true; blurry++; } // reuse flag to mean "excluded"
  }

  const selected = scored.filter((s) => !s.duplicate).map((s) => s.file);
  onStep(4, `Selected ${selected.length} best photos ✓`);

  return { selected, skippedDupes: dupes, skippedBlurry: blurry };
}

// ── Main component ────────────────────────────────────────────────────────────

export default function UploadPage() {
  const params       = useParams();
  const searchParams = useSearchParams();
  const router       = useRouter();

  const category    = typeof params.category    === "string" ? params.category    : "";
  const subcategory = typeof params.subcategory === "string" ? params.subcategory : "";
  const subTitle    = toTitle(subcategory);
  const pages       = Number(searchParams.get("pages") ?? 20);
  const color       = searchParams.get("color")    ?? "#7eb8d4";
  const symbol      = searchParams.get("symbol")   ?? "";
  const year        = searchParams.get("year")     ?? "";
  const textSize    = Number(searchParams.get("textSize") ?? 42);
  const iconSize    = Number(searchParams.get("iconSize") ?? 150);

  const minPhotos = pages * 2;
  const maxPhotos = pages * 4;

  type Mode  = "ai" | "manual";
  type Stage = "choosing" | "upload" | "analysing" | "editor";

  const [mode,    setMode]    = useState<Mode | null>(null);
  const [stage,   setStage]   = useState<Stage>("choosing");
  const [photos,  setPhotos]  = useState<UploadedPhoto[]>([]);
  const [pending, setPending] = useState<PendingPhoto[]>([]);
  const [dragOver,setDragOver]= useState(false);

  // AI analysis state
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>([
    { label: "Scan all photos",          done: false, detail: "" },
    { label: "Sort by date taken",       done: false, detail: "" },
    { label: "Remove duplicates",        done: false, detail: "" },
    { label: "Filter blurry shots",      done: false, detail: "" },
    { label: "Select best photos",       done: false, detail: "" },
  ]);
  const [analysisSummary, setAnalysisSummary] = useState<{ selected: number; dupes: number; blurry: number } | null>(null);
  const pendingFilesRef = useRef<File[]>([]);

  const totalCount = photos.length + pending.length;
  const canProceed = photos.length >= minPhotos && pending.length === 0;
  const atMax      = totalCount >= maxPhotos;
  const isUploading = pending.some((p) => !p.error);

  // ── Upload helper (XHR for per-file progress) ────────────────────────────────

  function uploadFile(file: File, tempId: string, onProgress: (pct: number) => void): Promise<UploadedPhoto> {
    return new Promise((resolve, reject) => {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", "zikra_book");
      fd.append("folder", `zikra_book/${category}/${subcategory}`);
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `https://api.cloudinary.com/v1_1/dis5pqgzn/image/upload`);
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
      });
      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const d = JSON.parse(xhr.responseText);
          resolve({ id: d.public_id, url: d.secure_url, publicId: d.public_id, name: file.name });
        } else {
          reject(new Error(`Upload failed: ${xhr.status}`));
        }
      });
      xhr.addEventListener("error", () => reject(new Error("Network error")));
      xhr.send(fd);
    });
  }

  async function uploadBatch(filesToUpload: File[]) {
    const newPending: PendingPhoto[] = filesToUpload.map((f) => ({
      tempId:     `tmp-${Date.now()}-${Math.random()}`,
      name:       f.name,
      previewUrl: URL.createObjectURL(f),
      progress:   0,
      error:      false,
    }));
    setPending((prev) => [...prev, ...newPending]);

    await Promise.all(filesToUpload.map(async (file, i) => {
      const tempId = newPending[i].tempId;
      try {
        const result = await uploadFile(file, tempId, (pct) => {
          setPending((prev) => prev.map((p) => p.tempId === tempId ? { ...p, progress: pct } : p));
        });
        setPending((prev) => prev.filter((p) => p.tempId !== tempId));
        setPhotos((prev) => [...prev, result]);
        URL.revokeObjectURL(newPending[i].previewUrl);
      } catch {
        setPending((prev) => prev.map((p) => p.tempId === tempId ? { ...p, error: true } : p));
      }
    }));
  }

  // ── File intake ──────────────────────────────────────────────────────────────

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) return;

    if (mode === "ai") {
      // Store files for analysis — don't upload yet
      pendingFilesRef.current = [...pendingFilesRef.current, ...imageFiles];
      // Show a lightweight preview grid while waiting
      const previews: PendingPhoto[] = imageFiles.map((f) => ({
        tempId:     `preview-${Date.now()}-${Math.random()}`,
        name:       f.name,
        previewUrl: URL.createObjectURL(f),
        progress:   100, // full — these are just local previews
        error:      false,
      }));
      setPending((prev) => [...prev, ...previews]);
    } else {
      // Manual: upload right away
      const spotsLeft = maxPhotos - totalCount;
      await uploadBatch(imageFiles.slice(0, spotsLeft));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, category, subcategory, maxPhotos, totalCount]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) handleFiles(e.target.files);
  }
  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setDragOver(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  }
  function removePhoto(id: string) { setPhotos((prev) => prev.filter((p) => p.id !== id)); }
  function retryPending(tempId: string) { setPending((prev) => prev.filter((p) => p.tempId !== tempId)); }

  // ── AI: run analysis then upload ────────────────────────────────────────────

  async function runAiAnalysis() {
    const allFiles = pendingFilesRef.current;
    if (allFiles.length === 0) return;

    // Clear local previews
    setPending([]);
    setStage("analysing");
    setAnalysisSteps((s) => s.map((x) => ({ ...x, done: false, detail: "" })));

    function onStep(i: number, detail: string) {
      setAnalysisSteps((prev) =>
        prev.map((s, idx) =>
          idx < i  ? { ...s, done: true } :
          idx === i ? { ...s, done: false, detail } :
          s
        )
      );
    }

    const { selected, skippedDupes, skippedBlurry } = await analyseFiles(allFiles, onStep);

    // Mark all steps done
    setAnalysisSteps((prev) => prev.map((s) => ({ ...s, done: true })));
    setAnalysisSummary({ selected: selected.length, dupes: skippedDupes, blurry: skippedBlurry });

    // Brief pause so customer can read the summary, then upload
    await new Promise((r) => setTimeout(r, 1800));

    const capped = selected.slice(0, maxPhotos);
    pendingFilesRef.current = [];
    setStage("upload");
    await uploadBatch(capped);
    // Auto-proceed to editor once all uploads finish
    setStage("editor");
  }

  // ── Render: mode chooser ─────────────────────────────────────────────────────

  if (stage === "choosing") {
    return (
      <>
        <Nav />
        <main className="min-h-screen bg-cream-50 pt-32 pb-24 px-6">
          <div className="max-w-2xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
              <p className="text-gold-500 text-xs tracking-[0.35em] uppercase mb-4 font-sans">Step 4 of 4</p>
              <h1 className="font-serif text-4xl md:text-5xl text-ink-900 mb-3 leading-tight">Upload your photos</h1>
              <p className="text-ink-700 font-sans text-sm max-w-md mx-auto">
                How would you like to build your {subTitle} book?
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-5">

              {/* AI option */}
              <motion.button
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                onClick={() => { setMode("ai"); setStage("upload"); }}
                className="group text-left bg-white border-2 border-gold-400/30 hover:border-gold-400 rounded-2xl p-7 transition-all duration-200 hover:shadow-lg relative overflow-hidden"
              >
                {/* Gold accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gold-gradient" />
                <div className="text-3xl mb-4">✨</div>
                <h2 className="font-serif text-xl text-ink-900 mb-2">AI Auto-Create</h2>
                <p className="text-ink-700 font-sans text-sm leading-relaxed mb-4">
                  Our AI instantly crafts your book. It picks the best shots, skips duplicates and blurry images, and organises everything chronologically — without you lifting a finger.
                </p>
                <ul className="flex flex-col gap-1.5 text-xs font-sans text-ink-600">
                  {["Removes duplicate shots", "Filters blurry photos", "Sorts by date taken", "Fills your book automatically"].map((t) => (
                    <li key={t} className="flex items-center gap-2">
                      <span className="text-gold-400">✓</span> {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 inline-flex items-center gap-2 text-gold-600 text-xs font-sans tracking-widest group-hover:gap-3 transition-all">
                  LET AI BUILD IT <span>→</span>
                </div>
              </motion.button>

              {/* Manual option */}
              <motion.button
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
                onClick={() => { setMode("manual"); setStage("upload"); }}
                className="group text-left bg-white border-2 border-gold-400/20 hover:border-gold-400/60 rounded-2xl p-7 transition-all duration-200 hover:shadow-md"
              >
                <div className="text-3xl mb-4">🎨</div>
                <h2 className="font-serif text-xl text-ink-900 mb-2">Build It Myself</h2>
                <p className="text-ink-700 font-sans text-sm leading-relaxed mb-4">
                  Upload your photos and choose exactly which ones go on each page. Full control over the layout and order of your book.
                </p>
                <ul className="flex flex-col gap-1.5 text-xs font-sans text-ink-600">
                  {["Choose every photo yourself", "Decide the page order", "Pick layouts per page", "Set borders your way"].map((t) => (
                    <li key={t} className="flex items-center gap-2">
                      <span className="text-ink-300">✓</span> {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 inline-flex items-center gap-2 text-ink-600 text-xs font-sans tracking-widest group-hover:gap-3 transition-all">
                  CHOOSE MY PHOTOS <span>→</span>
                </div>
              </motion.button>

            </div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="text-center mt-8"
            >
              <button onClick={() => router.back()} className="text-ink-400 text-sm font-sans hover:text-gold-500 transition-colors">
                ← Back
              </button>
            </motion.div>
          </div>
        </main>
      </>
    );
  }

  // ── Render: AI analysing screen ──────────────────────────────────────────────

  if (stage === "analysing") {
    return (
      <>
        <Nav />
        <main className="min-h-screen bg-cream-50 flex flex-col items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full text-center"
          >
            <div className="text-5xl mb-6">✨</div>
            <h1 className="font-serif text-3xl text-ink-900 mb-2">Crafting your book…</h1>
            <p className="text-ink-600 font-sans text-sm mb-10">
              Our AI is going through your photos. This only takes a moment.
            </p>

            <div className="bg-white border border-gold-400/20 rounded-2xl p-6 text-left flex flex-col gap-4">
              {analysisSteps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] mt-0.5 transition-all ${
                    step.done
                      ? "bg-gold-400 text-white"
                      : step.detail
                      ? "border-2 border-gold-400 bg-transparent"
                      : "border-2 border-cream-300 bg-transparent"
                  }`}>
                    {step.done ? "✓" : step.detail ? (
                      <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse block" />
                    ) : null}
                  </div>
                  <div>
                    <p className={`font-sans text-sm ${step.done ? "text-ink-900" : step.detail ? "text-ink-700" : "text-ink-300"}`}>
                      {step.label}
                    </p>
                    {step.detail && !step.done && (
                      <p className="text-ink-400 text-xs mt-0.5">{step.detail}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {analysisSummary && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 bg-gold-400/10 border border-gold-400/30 rounded-xl px-5 py-4 text-sm font-sans text-ink-700"
              >
                <span className="text-gold-600 font-medium">{analysisSummary.selected} photos selected</span>
                {analysisSummary.dupes > 0 && <span className="text-ink-400"> · {analysisSummary.dupes} duplicates removed</span>}
                {analysisSummary.blurry > 0 && <span className="text-ink-400"> · {analysisSummary.blurry} blurry shots skipped</span>}
                <p className="text-ink-400 text-xs mt-1">Uploading your best shots now…</p>
              </motion.div>
            )}
          </motion.div>
        </main>
      </>
    );
  }

  // ── Render: editor (AI auto-proceeded here) ──────────────────────────────────

  if (stage === "editor") {
    return (
      <BookEditor
        photos={photos}
        pages={pages}
        category={category}
        subcategory={subcategory}
        color={color}
        symbol={symbol}
        year={year}
        textSize={textSize}
        iconSize={iconSize}
        searchParams={Object.fromEntries(searchParams.entries())}
      />
    );
  }

  // ── Render: upload screen (both modes) ───────────────────────────────────────

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-cream-50 pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <button
              onClick={() => { setMode(null); setStage("choosing"); setPending([]); pendingFilesRef.current = []; }}
              className="text-gold-500 text-xs tracking-[0.35em] uppercase mb-4 font-sans inline-flex items-center gap-1 hover:text-gold-600 transition-colors"
            >
              ← {mode === "ai" ? "✨ AI Auto-Create" : "🎨 Build It Myself"}
            </button>
            <h1 className="font-serif text-4xl md:text-5xl text-ink-900 mb-3 leading-tight">Upload your photos</h1>
            <p className="text-ink-700 font-sans text-sm max-w-md mx-auto mb-4">
              {mode === "ai"
                ? "Upload all your photos — AI will pick the best ones and build your book automatically."
                : "Upload your photos and arrange them yourself on the next screen."}
            </p>
            <div className="inline-flex gap-4 bg-white border border-gold-400/20 rounded-xl px-6 py-3 text-xs font-sans">
              <span className="text-ink-700">📷 Min: <strong className="text-ink-900">{minPhotos} photos</strong></span>
              <span className="text-gold-400">|</span>
              <span className="text-ink-700">Max: <strong className="text-ink-900">{maxPhotos} photos</strong></span>
            </div>
          </motion.div>

          {/* Drop zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            onDragOver={(e) => { if (!atMax) { e.preventDefault(); setDragOver(true); } }}
            onDragLeave={() => setDragOver(false)}
            onDrop={atMax ? undefined : handleDrop}
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 mb-8 ${
              atMax
                ? "border-gold-400/20 bg-cream-100 opacity-50 cursor-not-allowed"
                : dragOver
                ? "border-gold-400 bg-gold-400/5"
                : "border-gold-400/30 bg-white hover:border-gold-400/60"
            }`}
          >
            {!atMax && (
              <input type="file" accept="image/*" multiple onChange={handleInputChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            )}
            <div className="text-4xl mb-4">{mode === "ai" ? "✨" : "📸"}</div>
            <p className="font-serif text-xl text-ink-900 mb-2">
              {atMax ? "Maximum reached" : "Drop your photos here"}
            </p>
            <p className="text-ink-700 font-sans text-sm mb-4">
              {atMax
                ? `You've reached the maximum of ${maxPhotos} photos for a ${pages}-page book`
                : "or click anywhere in this box to browse your files"}
            </p>
            {!atMax && (
              <span className="inline-block px-6 py-2 border border-gold-400/40 text-gold-600 text-xs tracking-widest rounded-full font-sans">
                BROWSE FILES
              </span>
            )}
          </motion.div>

          {/* Photo grid */}
          <AnimatePresence>
            {(photos.length > 0 || pending.length > 0) && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-serif text-lg text-ink-900">
                    {mode === "ai"
                      ? `${pending.length} photos ready for AI`
                      : `${photos.length} / ${maxPhotos} photos ${isUploading ? "uploading…" : "uploaded"}`}
                  </h2>
                  {mode === "manual" && <p className="text-ink-700 text-xs font-sans">Click ✕ to remove</p>}
                </div>

                {mode === "manual" && (
                  <div className="w-full bg-cream-200 rounded-full h-1.5 mb-4">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${photos.length >= minPhotos ? "bg-gold-400" : "bg-gold-300"}`}
                      style={{ width: `${Math.min((photos.length / minPhotos) * 100, 100)}%` }}
                    />
                  </div>
                )}

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {/* Done photos (manual mode) */}
                  {photos.map((photo) => (
                    <motion.div key={photo.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                      className="relative group aspect-square rounded-xl overflow-hidden bg-cream-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                      {mode === "manual" && (
                        <button onClick={() => removePhoto(photo.id)}
                          className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          ✕
                        </button>
                      )}
                    </motion.div>
                  ))}

                  {/* Pending photos */}
                  {pending.map((p) => (
                    <motion.div key={p.tempId} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                      className="relative aspect-square rounded-xl overflow-hidden bg-cream-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.previewUrl} alt={p.name}
                        className={`w-full h-full object-cover transition-all duration-300 ${p.error ? "opacity-40" : mode === "ai" ? "opacity-90" : "opacity-60 blur-[1px]"}`} />

                      {mode === "ai" && !p.error && (
                        // AI mode: show a sparkle badge, no upload bar yet
                        <div className="absolute bottom-1.5 right-1.5 bg-black/40 rounded-full px-1.5 py-0.5">
                          <span className="text-[9px] text-white font-sans">✨</span>
                        </div>
                      )}

                      {mode === "manual" && !p.error && (
                        <div className="absolute inset-0 flex flex-col items-end justify-end p-2">
                          <span className="text-white text-[10px] font-sans font-medium drop-shadow mb-1.5 self-center">{p.progress}%</span>
                          <div className="w-full bg-white/30 rounded-full h-1.5 overflow-hidden">
                            <div className="h-full bg-gold-400 rounded-full transition-all duration-150" style={{ width: `${p.progress}%` }} />
                          </div>
                        </div>
                      )}

                      {p.error && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
                          <span className="text-white text-xs font-sans mb-1">Failed</span>
                          <button onClick={() => retryPending(p.tempId)} className="text-[10px] font-sans text-gold-300 underline underline-offset-2">Remove</button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="h-24" />
        </div>
      </main>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-cream-50/95 backdrop-blur-sm border-t border-gold-400/20 px-6 py-4 z-40">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <button onClick={() => { setMode(null); setStage("choosing"); setPending([]); pendingFilesRef.current = []; }}
            className="text-ink-700 text-sm font-sans hover:text-gold-500 transition-colors">
            ← Back
          </button>
          <div className="flex flex-col items-end gap-1">
            {mode === "ai" ? (
              <>
                {pending.length === 0 && (
                  <p className="text-ink-400 text-xs font-sans">Add at least {minPhotos} photos for AI to work with</p>
                )}
                <button
                  onClick={runAiAnalysis}
                  disabled={pending.length < minPhotos}
                  className="px-10 py-3 bg-gold-gradient text-cream-50 rounded-full text-sm tracking-widest font-medium hover:opacity-90 transition-opacity shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ✨ BUILD MY BOOK →
                </button>
              </>
            ) : (
              <>
                {!canProceed && (
                  <p className="text-ink-400 text-xs font-sans">
                    {isUploading ? "Waiting for uploads to finish…"
                      : photos.length === 0 ? `Upload at least ${minPhotos} photos to continue`
                      : `${minPhotos - photos.length} more photo${minPhotos - photos.length !== 1 ? "s" : ""} needed`}
                  </p>
                )}
                <button
                  onClick={() => setStage("editor")}
                  disabled={!canProceed}
                  className="px-10 py-3 bg-gold-gradient text-cream-50 rounded-full text-sm tracking-widest font-medium hover:opacity-90 transition-opacity shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ARRANGE MY BOOK →
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
