import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "var(--bg)",
          secondary: "var(--bg-secondary)",
          card: "var(--bg-card)",
        },
        accent: {
          DEFAULT: "#6366f1",
          secondary: "#8b5cf6",
          glow: "rgba(99,102,241,0.2)",
        },
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        border: "var(--border)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-dark":
          "linear-gradient(135deg, #0f1117 0%, #1a1d27 50%, #0f1117 100%)",
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.8s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(99,102,241,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(99,102,241,0.6)" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      boxShadow: {
        "glow-sm": "0 0 15px rgba(99,102,241,0.3)",
        "glow-md": "0 0 30px rgba(99,102,241,0.4)",
        "glow-lg": "0 0 60px rgba(99,102,241,0.5)",
      },
    },
  },
  darkMode: ["class"],
};
export default config;
