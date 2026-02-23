/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0F17",
        surface: "#111827",
        muted: "#1F2937",

        primary: {
          DEFAULT: "#2563EB",
          light: "#3B82F6",
        },

        accent: "#22D3EE",
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
      },

      boxShadow: {
        glow: "0 0 20px rgba(37, 99, 235, 0.5)",
      },
    },
  },
  plugins: [],
}
