/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: { lato: ["Lato", "sans-serif"] },
      screens: {
        ph: "320px",
        // => @media (min-width: 320px) { ... }

        tab: "600px",
        // => @media (min-width: 600px) { ... }

        land: "768px",
        // => @media (min-width: 768px) { ... }

        lap: "1024px",
        // => @media (min-width: 1024px) { ... }

        desk: "1280px",
        // => @media (min-width: 1280px) { ... }

        lgScreen: "1440px",
        // => @media (min-width: 1440px) { ... }
      },
      colors: {
        youDark: "#0F172A", // Dark navy blue (slightly deeper for better contrast)
        youLight: "#1E293B", // Muted dark blue-gray (matches dark mode aesthetics)
        youMoreLight: "#334155", // Soft deep gray-blue (better contrast for secondary UI)
        youBtn: "#475569", // Slightly lighter blue-gray (good for subtle buttons)
        btnPrimary: "#6C5CE7", // Vibrant indigo-violet (kept same for main actions)
        btnDark: "#4F46E5", // Rich, deep royal blue (improved contrast from original)
        btnLight: "#818CF8", // Soft blue-violet (better readability and modern UI feel)
      },
    },
  },
  plugins: [],
};
