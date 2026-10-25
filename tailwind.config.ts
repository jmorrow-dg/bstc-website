import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Global league "Season" kit (25 Oct 2026). The old token names are
        // kept so every page restyles without a rewrite: `charcoal` is now
        // the page ground (paper), `white` is the text colour (navy), and
        // `grey` is a navy-tinted slate (6.9:1 on paper).
        brand: {
          charcoal: "#F4F4F1",
          red: "#B5241F",
          "red-dark": "#7E1714",
          "red-glow": "#7E1714",
          white: "#13213C",
          grey: "#4A5468",
          "grey-dark": "#3F4859",
          "grey-border": "#DCDAD3",
          paper: "#F4F4F1",
          navy: "#13213C",
          chalk: "#DCDAD3",
          crest: "#1A1A1A",
          "red-deep": "#7E1714",
        },
        // Navy for translucent rules and panels on paper (replaces the old
        // `white/x` utilities, which disappear on a light ground).
        ink: "#13213C",
      },
      fontFamily: {
        display: ["var(--font-display)", "Arial Narrow", "sans-serif"],
        body: ["var(--font-body)", "Helvetica Neue", "Arial", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      maxWidth: {
        site: "1200px",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        "count-up": "countUp 2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
