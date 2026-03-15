import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import fs from "fs";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    strictPort: true,
    port: 5173,
    allowedHosts: ["dev.moeenlaw.com"],
    https: {
      key: fs.readFileSync("./dev.moeenlaw.com+2-key.pem"),
      cert: fs.readFileSync("./dev.moeenlaw.com+2.pem"),
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});