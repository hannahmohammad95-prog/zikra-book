import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          50:  "#FDFAF4",
          100: "#F9F3E3",
          200: "#F2E8CA",
          300: "#E8D9A8",
        },
        gold: {
          300: "#D4B483",
          400: "#C49A5A",
          500: "#A87C3C",
          600: "#8A6225",
          700: "#6B4A10",
        },
        ink: {
          900: "#1A1208",
          800: "#2E2010",
          700: "#3D2D18",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans:  ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #D4B483 0%, #A87C3C 50%, #6B4A10 100%)",
      },
      keyframes: {
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.9s ease forwards",
        shimmer:   "shimmer 3s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
