import type { Metadata } from "next";

export const metadata: Metadata = {
  title:       "Contact — Zikra Book",
  description: "Questions, custom orders, or just want to say hi — we're always happy to chat. Reach us at hello@zikrabook.com.",
  openGraph: {
    title:       "Contact — Zikra Book",
    description: "Questions, custom orders, or just want to say hi — we're always happy to chat.",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
