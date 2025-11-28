/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sophisticated Wellness Palette
        'deep-teal': '#0A5F5F',
        'soft-teal': '#158B8B',
        'muted-teal': '#A8D5D5',
        'terracotta': '#D67B5C',
        'warm-terracotta': '#E89879',
        'rich-plum': '#6B5B8D',
        'soft-lavender': '#B8AED4',
        'warm-cream': '#FBF7F0',
        'deep-cream': '#F5EFE3',

        // Enhanced teal palette
        teal: {
          50: '#E6F3F3',
          100: '#CCE7E7',
          200: '#99CFCF',
          300: '#66B7B7',
          400: '#339F9F',
          500: '#158B8B',
          600: '#0A5F5F',
          700: '#084A4A',
          800: '#053535',
          900: '#032020',
        },

        // Terracotta palette
        terracotta: {
          50: '#FBEEE9',
          100: '#F7DDD3',
          200: '#EFBBA7',
          300: '#E7997B',
          400: '#DF774F',
          500: '#D67B5C',
          600: '#B85A3E',
          700: '#8A4429',
          800: '#5C2E1C',
          900: '#2E170E',
        },

        // Plum palette
        plum: {
          50: '#F0EDF5',
          100: '#E1DBEB',
          200: '#C3B7D7',
          300: '#A593C3',
          400: '#876FAF',
          500: '#6B5B8D',
          600: '#56486F',
          700: '#413653',
          800: '#2B2438',
          900: '#16121C',
        },

        // Warm neutrals
        cream: {
          DEFAULT: '#FBF7F0',
          light: '#FFF9F2',
          dark: '#F5EFE3',
        },
        charcoal: {
          DEFAULT: '#2D2D2D',
          light: '#4A4A4A',
          dark: '#1A1A1A',
        },

        // Legacy support (backwards compatibility)
        coral: {
          DEFAULT: '#D67B5C',
          light: '#E89879',
          dark: '#B85A3E',
        },
        sage: {
          DEFAULT: '#158B8B',
          light: '#A8D5D5',
          dark: '#0A5F5F',
        },
        lavender: {
          DEFAULT: '#B8AED4',
          light: '#E1DBEB',
          dark: '#6B5B8D',
        },
      },
      fontFamily: {
        display: ['Crimson Pro', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        accent: ['Sora', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },
      boxShadow: {
        'elegant': '0 20px 60px -15px rgba(10, 95, 95, 0.2), 0 10px 30px -10px rgba(10, 95, 95, 0.1)',
        'float': '0 30px 80px -20px rgba(10, 95, 95, 0.25), 0 15px 40px -15px rgba(10, 95, 95, 0.15)',
        'glass': '0 8px 32px 0 rgba(10, 95, 95, 0.1)',
        'soft': '0 2px 20px rgba(45, 45, 45, 0.08)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in-scale': 'fadeInScale 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-right': 'slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'breathe': 'breathe 4s ease-in-out infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
