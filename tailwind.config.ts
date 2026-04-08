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
        givre: "#F0F7FF",
        brume: "#DDEAFF",
        ceruleen: "#2E80CE",
        ardoise: "#1E3A5F",
        abyssal: "#0C2248",
        hausse: "#4ADE80",
        baisse: "#EF4444",
      },
      fontFamily: {
        cabinet: ["'Cabinet Grotesk'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
