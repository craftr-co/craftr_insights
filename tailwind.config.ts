import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-playfair)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        craftr: {
          bg: "#0D0D0D",
          card: "#161616",
          primary: "#FF6B35",
          secondary: "#FFB347",
          text: "#E8E8E0",
          muted: "#888880",
          border: "#2A2A2A",
          success: "#1AE59A",
        },
      },
      boxShadow: {
        glow: "0 0 40px rgba(255, 107, 53, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
