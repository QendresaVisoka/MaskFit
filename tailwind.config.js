// tailwind.config.js
const { nextui } = require("@nextui-org/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include your source files
    "./public/index.html", // Include your HTML if you have one
    "./node_modules/@nextui-org/theme/dist/components/**/*.js" // Include all NextUI components for styling
  ],
  theme: {
    extend: {},
  },
  darkMode: "class", // You might want to switch dark mode to 'media' if you want it to work based on user preferences.
  plugins: [nextui()],
};
