"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import Nav from "@/components/Nav";
import { TEMPLATES } from "@/data/templates";

const PAGE_OPTIONS = [
  { pages: 20, label: "20 Pages", price: 250, note: "Perfect for a short trip or event" },
  { pages: 40, label: "40 Pages", price: 350, note: "Our most popular — room to breathe", popular: true },
  { pages: 60, label: "60 Pages", price: 550, note: "The full story, nothing left out" },
];

// Make titles readable e.g. "saudi-arabia" → "Saudi Arabia"
function toTitle(slug: string) {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export default function SubcategoryPage() {
  const params      = useParams();
  const router      = useRouter();
  const category    = typeof params.category    === "string" ? params.category    : "";
  const subcategory = typeof params.subcategory === "string" ? params.subcategory : "";
  const subTitle    = toTitle(subcategory);

  const templates        = TEMPLATES[subcategory] ?? [];
  const [selectedTemplate, setSelectedTemplate] = useState<string>(templates[0]?.id ?? "");
  const [selectedPages, setSelectedPages] = useState<number>(40);
  const [form, setForm]   = useState({ name: "", email: "", phone: "", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim())  e.name  = "Please enter your name.";
    if (!form.email.trim()) e.email = "Please enter your email.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Please enter a valid email.";
    if (!form.phone.trim()) e.phone = "Please enter your phone number.";
    return e;
  }

  function handleContinue() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    const qs = new URLSearchParams({
      pages:    String(selectedPages),
      name:     form.name,
      email:    form.email,
      phone:    form.phone,
      notes:    form.notes,
      template: selectedTemplate,
    });
    router.push(`/create/${category}/${subcategory}/upload?${qs.toString()}`);
  }

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-cream-50 pt-32 pb-24 px-6">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <p className="text-gold-500 text-xs tracking-[0.35em] uppercase mb-4 font-sans">
              Step 2 of 3
            </p>
            <h1 className="font-serif text-4xl md:text-5xl text-ink-900 mb-3 leading-tight">
              Your {subTitle} Book
            </h1>
            <p className="text-ink-700 font-sans text-sm">
              Choose your size and tell us a little about yourself.
            </p>
          </motion.div>

          {/* Template gallery — only shown if templates exist for this country/occasion */}
          {templates.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-10"
            >
              <h2 className="font-serif text-lg text-ink-900 mb-4">Choose your template</h2>
              <div className={`grid gap-4 ${templates.length === 1 ? "grid-cols-1 max-w-xs" : "grid-cols-2 sm:grid-cols-3"}`}>
                {templates.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedTemplate(tpl.id)}
                    className={`group relative rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                      selectedTemplate === tpl.id
                        ? "border-gold-400 shadow-lg scale-[1.02]"
                        : "border-gold-400/20 hover:border-gold-400/60"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={tpl.imageUrl}
                      alt={tpl.name}
                      className="w-full aspect-[3/4] object-cover"
                    />
                    {/* Selected badge */}
                    {selectedTemplate === tpl.id && (
                      <div className="absolute top-2 right-2 bg-gold-gradient text-cream-50 text-[10px] tracking-widest px-2 py-0.5 rounded-full">
                        ✓ SELECTED
                      </div>
                    )}
                    <div className="p-3 bg-white text-left">
                      <p className="font-sans text-sm text-ink-900">{tpl.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Page count selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: templates.length > 0 ? 0.2 : 0.1 }}
            className="mb-10"
          >
            <h2 className="font-serif text-lg text-ink-900 mb-4">How many pages?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {PAGE_OPTIONS.map((opt) => (
                <button
                  key={opt.pages}
                  onClick={() => setSelectedPages(opt.pages)}
                  className={`relative rounded-xl border p-5 text-left transition-all duration-200 ${
                    selectedPages === opt.pages
                      ? "border-gold-400 bg-white shadow-md"
                      : "border-gold-400/20 bg-white hover:border-gold-400/50"
                  }`}
                >
                  {opt.popular && (
                    <span className="absolute -top-2.5 left-4 bg-gold-gradient text-cream-50 text-[10px] tracking-widest px-3 py-0.5 rounded-full">
                      POPULAR
                    </span>
                  )}
                  <p className="font-serif text-xl text-ink-900 mb-1">{opt.label}</p>
                  <p className="text-gold-600 font-sans text-sm font-medium mb-2">{opt.price} QAR</p>
                  <p className="text-ink-700 text-xs font-sans leading-snug">{opt.note}</p>
                  <div className={`mt-3 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedPages === opt.pages ? "border-gold-400 bg-gold-400" : "border-ink-300"
                  }`}>
                    {selectedPages === opt.pages && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Details form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-gold-400/20 p-8 mb-8"
          >
            <h2 className="font-serif text-lg text-ink-900 mb-6">Your details</h2>
            <div className="flex flex-col gap-5">

              <div>
                <label className="block text-xs tracking-widest uppercase text-ink-700 font-sans mb-1.5">Full Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Hannah Mohammed"
                  className="w-full border border-gold-400/30 rounded-lg px-4 py-3 text-sm font-sans text-ink-900 bg-cream-50 focus:outline-none focus:border-gold-400 transition-colors placeholder:text-ink-300"
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-ink-700 font-sans mb-1.5">Email Address *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full border border-gold-400/30 rounded-lg px-4 py-3 text-sm font-sans text-ink-900 bg-cream-50 focus:outline-none focus:border-gold-400 transition-colors placeholder:text-ink-300"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-ink-700 font-sans mb-1.5">Phone Number *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+974 5555 0000"
                  className="w-full border border-gold-400/30 rounded-lg px-4 py-3 text-sm font-sans text-ink-900 bg-cream-50 focus:outline-none focus:border-gold-400 transition-colors placeholder:text-ink-300"
                />
                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-ink-700 font-sans mb-1.5">
                  Special Requests <span className="normal-case tracking-normal text-ink-400">(optional)</span>
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Any special wishes, dedications, or requests for your book..."
                  rows={3}
                  className="w-full border border-gold-400/30 rounded-lg px-4 py-3 text-sm font-sans text-ink-900 bg-cream-50 focus:outline-none focus:border-gold-400 transition-colors placeholder:text-ink-300 resize-none"
                />
              </div>

            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 items-center"
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
