/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm coral/peach palette
        coral: {
          DEFAULT: '#FF8066',
          light: '#FF9B7F',
          dark: '#FF6B52',
          50: '#FFF5F3',
          100: '#FFE8E3',
          200: '#FFD1C7',
          300: '#FFBAAB',
          400: '#FFA38F',
          500: '#FF8066',
          600: '#FF6B52',
          700: '#F04E34',
          800: '#D13A22',
          900: '#A32B17',
        },
        // Sage green palette
        sage: {
          DEFAULT: '#9EAE8A',
          light: '#B8C5A8',
          dark: '#7A8A68',
          50: '#F5F7F2',
          100: '#E8EDE1',
          200: '#D5DFC9',
          300: '#C2D1B1',
          400: '#B0C09A',
          500: '#9EAE8A',
          600: '#7A8A68',
          700: '#5E6C51',
          800: '#464F3D',
          900: '#2F352A',
        },
        // Warm neutrals
        cream: {
          DEFAULT: '#FAF8F4',
          light: '#FFF9F2',
          dark: '#F5F1E8',
        },
        charcoal: {
          DEFAULT: '#2A2A2A',
          light: '#4A4A4A',
          dark: '#1A1A1A',
        },
        // Accent colors
        lavender: {
          DEFAULT: '#C8B6E2',
          light: '#E0D5F0',
          dark: '#B09DD4',
        },
        honey: {
          DEFAULT: '#F4D06F',
          light: '#F8E09F',
          dark: '#E6BC42',
        },
        // Keep primary for backwards compatibility
        primary: {
          50: '#FFF5F3',
          100: '#FFE8E3',
          200: '#FFD1C7',
          300: '#FFBAAB',
          400: '#FFA38F',
          500: '#FF8066',
          600: '#FF6B52',
          700: '#F04E34',
          800: '#D13A22',
          900: '#A32B17',
        },
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'glow-coral': '0 0 20px rgba(255, 128, 102, 0.3)',
        'glow-sage': '0 0 20px rgba(158, 174, 138, 0.3)',
        'soft': '0 2px 20px rgba(42, 42, 42, 0.08)',
      },
    },
  },
  plugins: [],
}
