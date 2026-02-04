/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'outlook-blue': '#0078d4',
        'outlook-blue-dark': '#106ebe',
        'outlook-blue-light': '#deecf9',
        'outlook-gray': '#f3f2f1',
        'outlook-border': '#edebe9',
        'outlook-text': '#323130',
        'outlook-text-secondary': '#605e5c',
      },
      fontFamily: {
        'segoe': ['"Segoe UI"', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
