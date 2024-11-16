// tailwind.config.js
const {nextui} = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include your source files
    "./public/index.html", // Include your HTML if you have one
    "./node_modules/@nextui-org/theme/dist/components/**/*.js" // Include all NextUI components for styling
  ],
  plugins: [
    nextui({
     
      themes: {
        dark: {
          colors: {
            primary: {
              DEFAULT: "#BEF264",
              foreground: "#000000",
            },
            focus: "#BEF264",
          },
        },
      },
    }),
  ],
};