/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#090a0f',
        glassBg: 'rgba(13, 16, 27, 0.45)',
        glassBorder: 'rgba(255, 255, 255, 0.05)',
        brandPrimary: '#10b981', // Emerald green
        brandSecondary: '#8b5cf6', // Violet purple
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
