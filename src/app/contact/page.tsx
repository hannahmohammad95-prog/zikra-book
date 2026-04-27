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
          <a
            href="https://www.instagram.com/zikrabook"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 group bg-white border border-gold-400/20 rounded-2xl p-6 text-center hover:border-gold-400/60 hover:shadow-md transition-all duration-200"
          >
            <div className="flex justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9 text-gold-500 group-hover:text-gold-600 transition-colors">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <p className="font-serif text-ink-900 mb-1">Instagram</p>
            <p className="text-gold-500 text-sm font-sans group-hover:text-gold-600 transition-colors">
              @zikrabook
            </p>
          </a>
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
