module.exports = {
  mode: "jit",
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "media",
  theme: { extend: {} },
  variants: { extend: {} },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/line-clamp")],
  // corePlugins: {
  //   preflight: false,
  // },
};
