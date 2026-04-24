"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { ShopifyProduct } from "@/lib/shopify";

type Props = { product: ShopifyProduct; index: number };

export default function ProductCard({ product, index }: Props) {
  const image  = product.images.edges[0]?.node;
  const price  = product.priceRange.minVariantPrice;

  // Format price — e.g. "QAR 390"
  const formattedPrice = new Intl.NumberFormat("en-QA", {
    style:    "currency",
    currency: price.currencyCode,
  }).format(Number(price.amount));

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-cream-100 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-500"
    >
      {/* Product image */}
      <div className="relative aspect-[3/4] bg-cream-200 overflow-hidden">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText ?? product.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          // Placeholder when no image is set yet
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-gold-400 text-4xl opacity-30">ذاكرة</span>
          </div>
        )}

        {/* Gold overlay on hover */}
        <div className="absolute inset-0 bg-gold-gradient opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
      </div>

      {/* Product info */}
      <div className="p-6">
        <h3 className="font-serif text-xl text-ink-900 mb-2">{product.title}</h3>
        <p className="text-ink-700 text-sm leading-relaxed line-clamp-2 mb-4 font-sans">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-gold-600 font-medium tracking-wide">{formattedPrice}</span>
          <a
            href={`https://zikra-book.myshopify.com/products/${product.handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs tracking-widest text-gold-500 border border-gold-400 px-4 py-2 rounded-full hover:bg-gold-400/10 transition-colors"
          >
            ORDER →
          </a>
        </div>
      </div>
    </motion.article>
  );
}
