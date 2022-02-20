module.exports = {
  mode: "jit",
  purge: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: { extend: {} },
  variants: { extend: {} },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/line-clamp")],
};
