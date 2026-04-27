import type { Metadata } from "next";

export const metadata: Metadata = {
  title:       "Create Your Book — Zikra Book",
  description: "Choose your destination, pick your pages, upload your photos and arrange your layout. Your heirloom photo book, delivered to your door in Qatar.",
  openGraph: {
    title:       "Create Your Book — Zikra Book",
    description: "Choose your destination, pick your pages, and start creating your heirloom photo book.",
  },
};

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
