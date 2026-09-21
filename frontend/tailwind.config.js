/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'ui-sans-serif', 'system-ui'],
        display: ['Space Grotesk', 'ui-sans-serif', 'system-ui'],
        serif: ['DM Serif Display', 'ui-serif', 'Georgia', 'serif'],
      },
      colors: {
        base: '#070b14',
        surface: '#0e1626',
        raised: 'rgba(255, 255, 255, 0.06)',
        inset: 'rgba(8, 13, 26, 0.5)',
        line: '#1c2739',
        'line-strong': '#2a3852',
        brand: {
          DEFAULT: '#22c58e',
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5EEAD4',
          400: '#34d399',
          500: '#22c58e',
          600: '#16a34a',
        },
      },
    },
  },
  plugins: [],
};
