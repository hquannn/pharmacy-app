import type { Config } from "tailwindcss"

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        primary: "#1668dc",
      },
    },
  },
  plugins: [],
  important: true,
  corePlugins: {
    preflight: false,
  },
} satisfies Config
