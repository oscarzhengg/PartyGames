/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          purple: '#8b5cf6',
          pink: '#ec4899',
        },
      },
      backgroundImage: {
        'gradient-purple-pink': 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0a0e27 0%, #000000 100%)',
      },
      height: {
        'screen-safe': '100dvh',
        'screen-ios': '-webkit-fill-available',
        'screen-dynamic': 'calc(var(--vh, 1vh) * 100)',
      },
      minHeight: {
        'screen-safe': '100dvh',
        'screen-ios': '-webkit-fill-available',
        'screen-dynamic': 'calc(var(--vh, 1vh) * 100)',
      },
      screens: {
        'landscape': { 'raw': '(orientation: landscape)' },
      },
    },
  },
  plugins: [],
}
