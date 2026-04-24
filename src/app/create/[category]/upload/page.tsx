"use client";

import { useState, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Nav from "@/components/Nav";
import BookEditor from "@/components/BookEditor";

const CATEGORY_NAMES: Record<string, string> = {
  travel:     "Travel",
  wedding:    "Wedding",
  birthday:   "Birthday",
  pregnancy:  "Pregnancy Journey",
  graduation: "Graduation",
  family:     "Family",
};

export type UploadedPhoto = {
  id:        string;
  url:       string;
  publicId:  string;
  name:      string;
};

export default function UploadPage() {
  const params      = useParams();
  const searchParams = useSearchParams();
  const router      = useRouter();

  const category = typeof params.category === "string" ? params.category : "";
  const title    = CATEGORY_NAMES[category] ?? "Your Book";
  const pages    = Number(searchParams.get("pages") ?? 20);

  const [photos, setPhotos]       = useState<UploadedPhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const [step, setStep]           = useState<"upload" | "editor">("upload");
  const [dragOver, setDragOver]   = useState(false);

  // Upload a single file to Cloudinary
  async function uploadFile(file: File): Promise<UploadedPhoto> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "zikra_book");
    formData.append("folder", `zikra_book/${category}`);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/dis5pqgzn/image/upload`,
      { method: "POST", body: formData }
    );
    const data = await res.json();
    return {
      id:       data.public_id,
      url:      data.secure_url,
      publicId: data.public_id,
      name:     file.name,
    };
  }

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) return;
    setUploading(true);
    try {
      const uploaded = await Promise.all(imageFiles.map(uploadFile));
      setPhotos((prev) => [...prev, ...uploaded]);
    } finally {
      setUploading(false);
    }
  }, [category]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) handleFiles(e.target.files);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  }

  function removePhoto(id: string) {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  }

  if (step === "editor") {
    return (
      <BookEditor
        photos={photos}
        pages={pages}
        category={category}
        searchParams={Object.fromEntries(searchParams.entries())}
      />
    );
  }

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-cream-50 pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <p className="text-gold-500 text-xs tracking-[0.35em] uppercase mb-4 font-sans">
              Step 3 of 3
            </p>
            <h1 className="font-serif text-4xl md:text-5xl text-ink-900 mb-3 leading-tight">
              Upload your photos
            </h1>
            <p className="text-ink-700 font-sans text-sm max-w-md mx-auto">
              Upload all the photos you want in your {title} book. You will arrange them on the next screen.
            </p>
          </motion.div>

          {/* Drop zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 mb-8 ${
              dragOver
                ? "border-gold-400 bg-gold-400/5"
                : "border-gold-400/30 bg-white hover:border-gold-400/60"
            }`}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="text-4xl mb-4">📸</div>
            <p className="font-serif text-xl text-ink-900 mb-2">
              {uploading ? "Uploading..." : "Drop your photos here"}
            </p>
            <p className="text-ink-700 font-sans text-sm mb-4">
              or click anywhere in this box to browse your files
            </p>
            {uploading && (
              <div className="flex justify-center">
                <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {!uploading && (
              <span className="inline-block px-6 py-2 border border-gold-400/40 text-gold-600 text-xs tracking-widest rounded-full font-sans">
                BROWSE FILES
              </span>
            )}
          </motion.div>

          {/* Uploaded photos grid */}
          <AnimatePresence>
            {photos.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-serif text-lg text-ink-900">
                    {photos.length} photo{photos.length !== 1 ? "s" : ""} uploaded
                  </h2>
                  <p className="text-ink-700 text-xs font-sans">Click ✕ to remove</p>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {photos.map((photo) => (
                    <motion.div
                      key={photo.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative group aspect-square rounded-xl overflow-hidden bg-cream-200"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.url}
                        alt={photo.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removePhoto(photo.id)}
                        className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        ✕
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <button
              onClick={() => router.back()}
              className="text-ink-700 text-sm font-sans hover:text-gold-500 transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={() => setStep("editor")}
              disabled={photos.length === 0}
              className="flex-1 sm:flex-none px-10 py-4 bg-gold-gradient text-cream-50 rounded-full text-sm tracking-widest font-medium hover:opacity-90 transition-opacity shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ARRANGE MY BOOK →
            </button>
          </div>
          {photos.length === 0 && (
            <p className="text-center text-ink-400 text-xs font-sans mt-3">
              Upload at least one photo to continue
            </p>
          )}

        </div>
      </main>
    </>
  );
}
