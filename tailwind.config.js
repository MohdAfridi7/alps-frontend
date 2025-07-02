/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // ✅ React components ko target karne ke liye
  ],
theme: {
    extend: {
      animation: {
        fadeInOut: 'fadeInOut 5s ease-in-out forwards',
      },
      keyframes: {
        fadeInOut: {
          '0%,100%': { opacity: 0 },
          '10%,90%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
