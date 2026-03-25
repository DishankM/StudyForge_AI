import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        surface: "#1a1a1a",
        card: "#1f1f1f",
        border: "rgba(255, 255, 255, 0.1)",
        primary: {
          pink: "#ff6b9d",
          purple: "#c06ff5",
          violet: "#8b5cf6",
        },
        text: {
          primary: "#ffffff",
          secondary: "#a0a0a0",
          muted: "#6b7280",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-hero":
          "linear-gradient(135deg, #0a0a0a 0%, #1a0a14 50%, #0a0a1a 100%)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-delayed": "float 8s ease-in-out infinite 2s",
        "float-slow": "float 10s ease-in-out infinite 1s",
        marquee: "marquee 30s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) translateX(0)" },
          "33%": { transform: "translateY(-20px) translateX(10px)" },
          "66%": { transform: "translateY(-10px) translateX(-10px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      boxShadow: {
        glow: "0 0 40px rgba(255, 107, 157, 0.3)",
        "glow-purple": "0 0 40px rgba(192, 111, 245, 0.3)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
