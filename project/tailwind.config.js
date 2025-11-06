/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0eefe',
          200: '#bae0fd',
          300: '#7dcbfa',
          400: '#38b0f5',
          500: '#0c96e6',
          600: '#0178c3',
          700: '#01609e',
          800: '#065283',
          900: '#0c456c',
          950: '#082c47',
        },
        secondary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        accent: {
          50: '#fffaeb',
          100: '#fef2c7',
          200: '#fee589',
          300: '#fdd24b',
          400: '#fcba1f',
          500: '#f99c07',
          600: '#dd7502',
          700: '#b75305',
          800: '#94400c',
          900: '#7a360e',
          950: '#461b04',
        },
        neutral: {
          50: '#f7f7f8',
          100: '#eeeef0',
          200: '#d9d9de',
          300: '#b8b9c2',
          400: '#9294a2',
          500: '#767887',
          600: '#5f616d',
          700: '#4d4f59',
          800: '#42444c',
          900: '#3a3c43',
          950: '#242529',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'typing': 'typing 1.5s steps(3, end) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out forwards',
        'slide-up': 'slideUp 0.3s ease-out forwards',
      },
      keyframes: {
        typing: {
          '0%': { width: '0' },
          '33%': { width: '0.5em' },
          '66%': { width: '1em' },
          '100%': { width: '1.5em' }
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 }
        },
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.1)',
        'message': '0 2px 6px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}