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
    },
  },
  plugins: [],
};
