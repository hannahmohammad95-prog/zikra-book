import type { Metadata } from "next";

export const metadata: Metadata = {
  title:       "Our Story — Zikra Book",
  description: "Born from a love of travel and a desire to never forget. Every Zikra Book is printed with the highest quality and crafted to last for generations.",
  openGraph: {
    title:       "Our Story — Zikra Book",
    description: "Born from a love of travel and a desire to never forget.",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
