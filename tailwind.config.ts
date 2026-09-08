import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#161310",
        ivory: "#F6F1EB",
        sand: "#E8DFD0",
        champagne: "#C4A06A",
        sage: "#3F4F44",
        rose: "#C9A39A",
        mist: "#FBF8F4",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 24px 80px -32px rgba(196, 160, 106, 0.45)",
        card: "0 18px 40px -24px rgba(22, 19, 16, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
