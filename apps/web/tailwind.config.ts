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
        background: "var(--background)",
        foreground: "var(--foreground)",
        citizen: {
          deep: "var(--c-bg-deep)",
          bg: "var(--c-bg)",
          elevated: "var(--c-bg-elevated)",
          muted: "var(--c-bg-muted)",
          border: "var(--c-border)",
          "border-subtle": "var(--c-border-subtle)",
          text: "var(--c-text)",
          "text-muted": "var(--c-text-muted)",
          "text-dim": "var(--c-text-dim)",
          accent: "var(--c-accent)",
          warm: "var(--c-accent-warm)",
          gold: "var(--c-accent-gold)",
          sand: "var(--c-accent-sand)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        "fade-up-delay-1": "fade-up 0.6s ease-out 150ms both",
        "fade-up-delay-2": "fade-up 0.6s ease-out 300ms both",
        "fade-up-delay-3": "fade-up 0.6s ease-out 450ms both",
        "slide-in-left": "slide-in-left 0.6s ease-out both",
        "gradient-shift": "gradient-shift 15s ease infinite",
        "scale-in": "scale-in 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;
