import { defineConfig } from "vite-plus";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  base: process.env.GITHUB_PAGES ? "/trainer/" : "/",
  staged: {
    "*": "vp check --fix",
  },
  fmt: {
    ignorePatterns: [".agents/**", ".claude/**", "dist/**"],
  },
  lint: {
    ignorePatterns: [".agents/**", ".claude/**", "dist/**"],
    options: { typeAware: true, typeCheck: true },
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
