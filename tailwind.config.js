/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/renderer/src/**/*.{js,ts,jsx,tsx}',
    './src/renderer/src/**/*.css',
    './src/renderer/src/components/**/*.css',
    './src/renderer/src/components/**/styles.css'
  ],
  theme: {
    extend: {}
  },
  plugins: [],
  // Ensure all variants are available
  variants: {
    extend: {}
  }
}
