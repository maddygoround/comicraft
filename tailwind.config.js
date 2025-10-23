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
        'display': ['Bangers', 'cursive'],
        'body': ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#FFD700',
        'primary-dark': '#FFC700',
        secondary: '#0052FF',
        'background-light': '#FFFFFF',
        'background-dark': '#1A1A1A',
        'text-light': '#1A1A1A',
        'text-dark': '#FFFFFF',
        'accent-red': '#FF3B30',
        'accent-green': '#34C759',
        'accent-purple': '#AF52DE',
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        'full': '9999px',
      },
      boxShadow: {
        'pop-out': '0px 4px 0px 0px #000000',
        'pop-out-dark': '0px 4px 0px 0px #FFD700',
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
