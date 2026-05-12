"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Nav from "@/components/Nav";

type SubOption = { slug: string; emoji: string; title: string };

const SUB_OPTIONS: Record<string, SubOption[]> = {
  travel: [
    { slug: "qatar",        emoji: "🇶🇦", title: "Qatar"        },
    { slug: "uae",          emoji: "🇦🇪", title: "UAE"          },
    { slug: "saudi-arabia", emoji: "🇸🇦", title: "Saudi Arabia" },
    { slug: "jordan",       emoji: "🇯🇴", title: "Jordan"       },
    { slug: "egypt",        emoji: "🇪🇬", title: "Egypt"        },
    { slug: "morocco",      emoji: "🇲🇦", title: "Morocco"      },
    { slug: "turkey",       emoji: "🇹🇷", title: "Turkey"       },
    { slug: "france",       emoji: "🇫🇷", title: "France"       },
    { slug: "italy",        emoji: "🇮🇹", title: "Italy"        },
    { slug: "spain",        emoji: "🇪🇸", title: "Spain"        },
    { slug: "portugal",     emoji: "🇵🇹", title: "Portugal"     },
    { slug: "australia",    emoji: "🇦🇺", title: "Australia"    },
    { slug: "new-zealand",  emoji: "🇳🇿", title: "New Zealand"  },
    { slug: "japan",        emoji: "🇯🇵", title: "Japan"        },
    { slug: "singapore",    emoji: "🇸🇬", title: "Singapore"    },
    { slug: "china",        emoji: "🇨🇳", title: "China"        },
    { slug: "thailand",     emoji: "🇹🇭", title: "Thailand"     },
    { slug: "indonesia",    emoji: "🇮🇩", title: "Indonesia"    },
    { slug: "vietnam",      emoji: "🇻🇳", title: "Vietnam"      },
    { slug: "south-africa", emoji: "🇿🇦", title: "South Africa" },
    { slug: "tanzania",     emoji: "🇹🇿", title: "Tanzania"     },
    { slug: "canada",       emoji: "🇨🇦", title: "Canada"       },
    { slug: "mexico",       emoji: "🇲🇽", title: "Mexico"       },
    { slug: "peru",         emoji: "🇵🇪", title: "Peru"         },
    { slug: "argentina",    emoji: "🇦🇷", title: "Argentina"    },
    { slug: "ecuador",      emoji: "🇪🇨", title: "Ecuador"      },
    { slug: "puerto-rico",  emoji: "🇵🇷", title: "Puerto Rico"  },
    { slug: "greece",       emoji: "🇬🇷", title: "Greece"       },
    { slug: "sri-lanka",    emoji: "🇱🇰", title: "Sri Lanka"    },
  ],
  occasions: [
    { slug: "wedding",    emoji: "💍", title: "Wedding"           },
    { slug: "birthday",   emoji: "🎂", title: "Birthday"          },
    { slug: "graduation", emoji: "🎓", title: "Graduation"        },
    { slug: "pregnancy",  emoji: "🤰", title: "Pregnancy Journey" },
  ],
  family: [
    { slug: "sibling-book",  emoji: "👫", title: "Sibling Book"       },
    { slug: "mothers-day",   emoji: "💐", title: "Mother's Day"        },
    { slug: "fathers-day",   emoji: "👔", title: "Father's Day"        },
    { slug: "annual-book",   emoji: "📖", title: "Annual Family Book"  },
    { slug: "reunion",       emoji: "🏡", title: "Family Reunion"      },
  ],
};

const CATEGORY_TITLES: Record<string, { title: string; subtitle: string }> = {
  travel:    { title: "Where did you go?",        subtitle: "Choose your destination and we'll tailor your book to that journey." },
  occasions: { title: "What's the occasion?",     subtitle: "Pick the milestone and we'll craft every page around it." },
  family:    { title: "What kind of family book?", subtitle: "Choose the type and we'll make it one they'll treasure forever." },
};

const container = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.05 } },
};

const card = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function CategoryPage() {
  const params   = useParams();
  const router   = useRouter();
  const category = typeof params.category === "string" ? params.category : "";
  const options  = SUB_OPTIONS[category] ?? [];
  const meta     = CATEGORY_TITLES[category] ?? { title: "Choose your book", subtitle: "" };

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-cream-50 pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <p className="text-gold-500 text-xs tracking-[0.35em] uppercase mb-4 font-sans">
              Step 1 of 3
            </p>
            <h1 className="font-serif text-4xl md:text-5xl text-ink-900 mb-3 leading-tight">
              {meta.title}
            </h1>
            <p className="text-ink-700 font-sans text-sm max-w-md mx-auto">
              {meta.subtitle}
            </p>
          </motion.div>

          {/* Sub-options grid */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className={`grid gap-3 ${
              category === "travel"
                ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
                : "grid-cols-1 sm:grid-cols-2"
            }`}
          >
            {options.map((opt) => (
              <motion.div key={opt.slug} variants={card}>
                <Link
                  href={`/create/${category}/${opt.slug}`}
                  className="group flex items-center gap-3 p-4 bg-white rounded-xl border border-gold-400/20 hover:border-gold-400/60 hover:shadow-md transition-all duration-200"
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className="font-sans text-sm text-ink-900 group-hover:text-gold-600 transition-colors">
                    {opt.title}
                  </span>
                  <span className="ml-auto text-gold-400 text-xs group-hover:translate-x-0.5 transition-transform">→</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Back */}
          <div className="mt-10 text-center">
            <button
              onClick={() => router.back()}
              className="text-ink-700 text-sm font-sans hover:text-gold-500 transition-colors"
            >
              ← Back
            </button>
          </div>

        </div>
      </main>
    </>
  );
}
