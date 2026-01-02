import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/

import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    css: true,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@api": path.resolve(__dirname, "src/api"),
      "@pages": path.resolve(__dirname, "src/pages"),
    },
  },
} as any);
