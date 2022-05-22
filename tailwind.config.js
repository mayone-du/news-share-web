/**
 * @type {import('@types/tailwindcss/tailwind-config').TailwindConfig}
 */

// NOTE: mantineのdefault themeと合わせる

module.exports = {
  mode: "jit",
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "dark-7": "#1A1B1E",
        "dark-6": "#25262B",
        "dark-5": "#2C2E33",
        "dark-1": "#A6A7AB",
        "dark-0": "#C1C2C5",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/line-clamp")],
  // corePlugins: {
  //   preflight: false,
  // },
};
