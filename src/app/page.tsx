// This is the homepage — a Server Component.
// It fetches Shopify products on the server (fast, no loading spinner needed).
// Each visual section is a Client Component that uses Framer Motion.

import Nav           from "@/components/Nav";
import Hero          from "@/components/Hero";
import BookViewer    from "@/components/BookViewer";
import StickySection from "@/components/StickySection";
import ProductCard   from "@/components/ProductCard";
import { getProducts, type ShopifyProduct } from "@/lib/shopify";

export default async function HomePage() {
  // Fetch products — if the token isn't set yet, we show an empty grid
  let products: ShopifyProduct[] = [];
  try {
    products = await getProducts(6);
  } catch (_e) {
    console.error("Shopify fetch error:", _e);
  }

  return (
    <>
      <Nav />

      {/* 1. Full-screen cinematic opening */}
      <Hero />

      {/* 2. 3D rotating book with scroll-linked rotation */}
      <BookViewer />

      {/* 3. Apple-style sticky process sections */}
      <StickySection />

      {/* 4. Product grid pulled from Shopify */}
      <section id="books" className="py-24 px-6 bg-cream-50">
        <div className="max-w-6xl mx-auto">
          <p className="text-gold-500 text-xs tracking-[0.35em] uppercase mb-4 text-center">The Collection</p>
          <h2 className="font-serif text-4xl md:text-5xl text-ink-900 text-center mb-16 leading-tight">
            Choose your edition.
          </h2>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          ) : (
            // Shown before you configure the Shopify token
            <div className="text-center py-20 text-ink-700">
              <p className="font-serif text-2xl mb-3 text-gold-500">Coming soon.</p>
              <p className="text-sm font-sans">
                Add your Shopify Storefront token to <code className="bg-cream-200 px-2 py-0.5 rounded">.env.local</code> to see your products here.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="bg-ink-900 text-cream-200/60 py-16 px-6 text-center">
        <p className="font-serif text-gold-400 text-2xl mb-1">Zikra Book</p>
        <p className="text-xs tracking-widest uppercase mb-8">Every journey deserves a page.</p>
        <div className="flex justify-center gap-8 text-xs mb-8">
          <a href="/about"              className="hover:text-gold-400 transition-colors">About</a>
          <a href="/contact"            className="hover:text-gold-400 transition-colors">Contact</a>
          <a href="/#books"             className="hover:text-gold-400 transition-colors">Books</a>
          <a href="mailto:hello@zikrabook.com" className="hover:text-gold-400 transition-colors">hello@zikrabook.com</a>
        </div>
        <p className="text-xs opacity-40">© {new Date().getFullYear()} Zikra Book. All rights reserved.</p>
      </footer>
    </>
  );
}
