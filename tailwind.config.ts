import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          50: "#faf8f5",
          100: "#f3efe8",
          200: "#e8e0d3",
          300: "#d5c9b5",
          400: "#bfab91",
          500: "#a99070",
          600: "#9a7e5d",
          700: "#80674e",
          800: "#695443",
          900: "#564639",
        },
        forest: {
          50: "#f0f9f8",
          100: "#d9f0ed",
          200: "#b7e1db",
          300: "#89cdc4",
          400: "#5bbdb0",
          500: "#49a59a",
          600: "#3a8a81",
          700: "#316f69",
          800: "#2b5954",
          900: "#274b48",
        },
        ink: {
          50: "#f6f6f7",
          100: "#e1e2e5",
          200: "#c3c5ca",
          300: "#9ea1a8",
          400: "#797d86",
          500: "#5f636c",
          600: "#4b4e56",
          700: "#3e4046",
          800: "#34363a",
          900: "#1a1b1e",
        },
      },
      fontFamily: {
        display: ['"DM Serif Display"', "Georgia", "serif"],
        body: ['"DM Sans"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
