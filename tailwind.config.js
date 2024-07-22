const { iconsPlugin, getIconCollections } = require("@egoist/tailwindcss-icons")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'main': {
          '50': '#ebf9ff',
          '100': '#d1f1ff',
          '200': '#aee7ff',
          '300': '#76dbff',
          '400': '#35c4ff',
          '500': '#07a0ff',
          '600': '#007bff',
          '700': '#0062ff',
          '800': '#0051d7',
          '900': '#003f91',
          '950': '#062d65',
        },  
        'secondary': {
          '50': '#eefff0',
          '100': '#d7ffdf',
          '200': '#b2ffc0',
          '300': '#77fe92',
          '400': '#35f35b',
          '500': '#0add35',
          '600': '#02b727',
          '700': '#068f22',
          '800': '#0b7020',
          '900': '#0b5d1e',
          '950': '#00340c',
        },
      }
    }
  },
  plugins: [
    iconsPlugin({
      // Select the icon collections you want to use
      // You can also ignore this option to automatically discover all individual icon packages you have installed
      // If you install @iconify/json, you should explicitly specify the collections you want to use, like this:
      collections: getIconCollections(["carbon", "lucide"]),
      // If you want to use all icons from @iconify/json, you can do this:
      // collections: getIconCollections("all"),
      // and the more recommended way is to use `dynamicIconsPlugin`, see below.
    }),
  ],
}

