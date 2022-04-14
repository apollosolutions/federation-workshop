import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "src",
  publicDir: "../public",
  esbuild: {
    loader: "jsx",
  },
  build: {
    outDir: "../dist",
  },
  plugins: [
    react({
      include: "**/*.{jsx,tsx}",
    }),
  ],
});
