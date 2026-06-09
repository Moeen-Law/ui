
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import fs from "fs";

const keyPath = "./dev.moeenlaw.com+2-key.pem";
const certPath = "./dev.moeenlaw.com+2.pem";

let httpsConfig = undefined;
if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  httpsConfig = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return;
          }

          if (id.includes("react-dom") || id.includes("react/") || id.includes("scheduler")) {
            return "react-vendor";
          }

          if (id.includes("react-router")) {
            return "router-vendor";
          }

          if (id.includes("@tanstack")) {
            return "query-vendor";
          }

          if (id.includes("recharts")) {
            return "charts-vendor";
          }

          if (id.includes("i18next") || id.includes("react-i18next")) {
            return "i18n-vendor";
          }

          if (id.includes("framer-motion") || id.includes("motion-dom") || id.includes("motion-utils")) {
            return "motion-vendor";
          }

          if (id.includes("zod") || id.includes("react-hook-form") || id.includes("@hookform")) {
            return "forms-vendor";
          }

          if (id.includes("react-markdown") || id.includes("remark-") || id.includes("unified") || id.includes("mdast") || id.includes("micromark")) {
            return "markdown-vendor";
          }

          if (id.includes("radix-ui") || id.includes("@radix-ui") || id.includes("lucide-react") || id.includes("sonner") || id.includes("vaul") || id.includes("cmdk")) {
            return "ui-vendor";
          }

          if (id.includes("axios") || id.includes("@microsoft/fetch-event-source")) {
            return "network-vendor";
          }

          return;
        },
      },
    },
  },
  server: {
    host: true,
    strictPort: true,
    port: 5173,
    allowedHosts: ["dev.moeenlaw.com"],
    https: httpsConfig,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

