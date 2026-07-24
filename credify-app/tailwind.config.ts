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
        void: "#0A0A14",
        plasma: "#7B61FF",
        ghost: "#F0EFF4",
        graphite: "#18181B",
      },
      fontFamily: {
        sora: ["var(--font-sora)", "sans-serif"],
        drama: ["var(--font-instrument)", "serif"],
        data: ["var(--font-fira-code)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
