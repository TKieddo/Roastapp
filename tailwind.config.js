/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#AEFF00',
          dark: '#8BCC00',
        },
        background: {
          light: '#FFFFFF',
          dark: '#000000',
        },
        card: {
          light: '#F8F9FA',
          dark: '#111111',
        },
        text: {
          light: '#1A1A1B',
          dark: '#FFFFFF',
        },
        border: {
          light: '#E5E7EB',
          dark: 'rgba(174, 255, 0, 0.2)',
        },
      },
      spacing: {
        'component': '16px',
      },
    },
  },
  plugins: [],
};