/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./App.tsx"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#67e8f9', // cyan-300
          DEFAULT: '#06b6d4', // cyan-500
          dark: '#0e7490', // cyan-700
        },
        secondary: {
          light: '#818cf8', // indigo-400
          DEFAULT: '#4f46e5', // indigo-600
          dark: '#3730a3', // indigo-800
        },
        textPrimary: '#1f2937', // gray-800
        textSecondary: '#4b5563', // gray-600
        surface: '#ffffff', // white
        background: '#f3f4f6', // gray-100
        'primary-light': '#67e8f9', // Alias for compatibility with existing classes
        'brand-blue': '#3B82F6', // Added for landing page emphasis
        'brand-gray': {
          DEFAULT: '#6B7280',
          light: '#9CA3AF',
          dark: '#4B5563',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        nav: ['Poppins', 'sans-serif'], // Added Poppins for navigation
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ],
  corePlugins: {
    preflight: true,
  },
} 