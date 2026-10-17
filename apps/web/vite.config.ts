import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const apiTarget = process.env.VITE_DEV_API_PROXY ?? "http://localhost:4000";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  server: {
    port: 5173,
    // In development the API is reached through the dev server, so cookies stay same-origin.
    proxy: {
      "/api": { target: apiTarget, changeOrigin: true },
      "/socket.io": { target: apiTarget, ws: true, changeOrigin: true },
    },
  },
  build: {
    // Monaco is large but only loaded by the editor pages.
    chunkSizeWarningLimit: 4000,
    rollupOptions: {
      output: {
        manualChunks: (id) => (id.includes("node_modules/monaco-editor") ? "monaco" : undefined),
      },
    },
  },
});
