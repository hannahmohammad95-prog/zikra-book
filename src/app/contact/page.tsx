"use client";

import { motion } from "framer-motion";
import Nav from "@/components/Nav";

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-cream-50 flex flex-col items-center justify-center px-6 py-32">

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-gold-500 text-xs tracking-[0.35em] uppercase mb-4 font-sans"
        >
          Get in touch
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-serif text-4xl md:text-5xl text-ink-900 mb-4 text-center leading-tight"
        >
          We&apos;d love to hear from you.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-ink-700 font-sans text-sm max-w-sm text-center mb-12"
        >
          Questions, custom orders, or just want to say hi — we&apos;re always happy to chat.
        </motion.p>

        {/* Contact cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 w-full max-w-lg"
        >
          {/* Email */}
          <a
            href="mailto:hello@zikrabook.com"
            className="flex-1 group bg-white border border-gold-400/20 rounded-2xl p-6 text-center hover:border-gold-400/60 hover:shadow-md transition-all duration-200"
          >
            <div className="text-3xl mb-3">📧</div>
            <p className="font-serif text-ink-900 mb-1">Email us</p>
            <p className="text-gold-500 text-sm font-sans group-hover:text-gold-600 transition-colors">
              hello@zikrabook.com
            </p>
          </a>

          {/* Instagram */}
          <div className="flex-1 bg-white border border-gold-400/20 rounded-2xl p-6 text-center opacity-60">
            <div className="text-3xl mb-3">📸</div>
            <p className="font-serif text-ink-900 mb-1">Instagram</p>
            <p className="text-ink-400 text-sm font-sans">Coming soon</p>
          </div>
        </motion.div>

        {/* Response time note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-ink-400 text-xs font-sans mt-8"
        >
          We typically respond within 24 hours 🤍
        </motion.p>

      </main>
    </>
  );
}
