/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'space-grotesk': ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#E3C5F0',
          100: '#C2A4DC',
          200: '#A183B8',
          300: '#806294',
          400: '#5E4270',
          500: '#E3C5F0',
          600: '#C2A4DC',
          700: '#A183B8',
          800: '#806294',
          900: '#5E4270',
        },
        purple: {
          50: '#E3C5F0',
          100: '#C2A4DC',
          200: '#A183B8',
          300: '#806294',
          400: '#5E4270',
          500: '#E3C5F0',
          600: '#C2A4DC',
          700: '#A183B8',
          800: '#806294',
          900: '#5E4270',
        },
        'purple-light': '#E3C5F0',
        'purple-pale': '#C2A4DC',
        'purple-medium': '#A183B8',
        'purple-soft': '#806294',
        'purple-dark': '#5E4270',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(183, 163, 227, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(183, 163, 227, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200px 0' },
          '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
        },
      },
    },
  },
  plugins: [],
}

