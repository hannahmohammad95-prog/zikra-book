"use client";

import { motion } from "framer-motion";
import Nav from "@/components/Nav";
import Link from "next/link";

const values = [
  { emoji: "🖨️", title: "Museum-quality print",    body: "Every page is printed with precision on heavyweight matte art paper. Colours that stay vivid for generations." },
  { emoji: "✨", title: "Aesthetic by design",      body: "We obsess over every detail — the layout, the spacing, the flow. Your book should feel as beautiful as the memory." },
  { emoji: "🌍", title: "Every place, every moment", body: "Travel, weddings, birthdays, pregnancies — if it matters to you, it deserves a page." },
  { emoji: "🤍", title: "Made with love",            body: "This isn't a print shop. Every book is handled by a real person who cares about getting it right." },
];

const container = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-cream-50">

        {/* Hero */}
        <section className="pt-40 pb-24 px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-gold-500 text-xs tracking-[0.35em] uppercase mb-4 font-sans"
          >
            Our Story
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-4xl md:text-6xl text-ink-900 leading-tight mb-6 max-w-2xl mx-auto"
          >
            Born from a love of travel<br />and a desire to never forget.
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-12 h-px bg-gold-400 mx-auto opacity-60"
          />
        </section>

        {/* Story */}
        <section className="px-6 pb-24 max-w-2xl mx-auto">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex flex-col gap-6 text-ink-700 font-sans text-base leading-relaxed"
          >
            <motion.p variants={item}>
              Some memories deserve more than a phone gallery. They deserve a page.
            </motion.p>
            <motion.p variants={item}>
              Zikra Book was born from a simple love — the love of traveling, of collecting moments,
              of holding onto the feeling of a place long after you&apos;ve left it. Our founder wanted
              something better than scattered photos on a phone or a generic album gathering dust on a shelf.
              She wanted something that felt as beautiful as the memory itself.
            </motion.p>
            <motion.p variants={item}>
              So she created it.
            </motion.p>
            <motion.p variants={item}>
              Every Zikra Book is printed with the highest quality, designed with an aesthetic eye,
              and crafted to sit on your shelf for generations. Not just a photo book —
              a piece of your story, bound in gold.
            </motion.p>
            <motion.p variants={item} className="font-serif text-xl text-ink-900 italic">
              &ldquo;Every journey deserves a page.&rdquo;
            </motion.p>
          </motion.div>
        </section>

        {/* Values */}
        <section className="bg-white px-6 py-24">
          <div className="max-w-4xl mx-auto">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-gold-500 text-xs tracking-[0.35em] uppercase mb-4 font-sans text-center"
            >
              What we stand for
            </motion.p>
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-10"
            >
              {values.map((v) => (
                <motion.div key={v.title} variants={item} className="flex gap-4">
                  <span className="text-3xl">{v.emoji}</span>
                  <div>
                    <h3 className="font-serif text-lg text-ink-900 mb-1">{v.title}</h3>
                    <p className="text-ink-700 font-sans text-sm leading-relaxed">{v.body}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-24 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl md:text-4xl text-ink-900 mb-6"
          >
            Ready to make your book?
          </motion.h2>
          <Link
            href="/create"
            className="inline-block px-10 py-4 bg-gold-gradient text-cream-50 rounded-full text-sm tracking-widest font-medium hover:opacity-90 transition-opacity shadow-lg"
          >
            CREATE MY BOOK
          </Link>
        </section>

      </main>
    </>
  );
}
