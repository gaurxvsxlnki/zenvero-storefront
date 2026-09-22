import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { zenveroVaultServer } from "./plugins/vaultServer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteSingleFile(),
    // Entitlement-checked PDF vault (demo server for paid downloads, zv-001).
    zenveroVaultServer(),
  ],
  server: {
    // Bind on all interfaces and accept the sandboxed preview origin so the
    // running storefront can be viewed through the Arena live preview proxy.
    // Dev-server only — does not affect the production (single-file) build.
    host: true,
    allowedHosts: true,
    fs: {
      // Defense in depth: never let the dev server's static file serving
      // touch the private vault directory. The vault plugin also hard-blocks
      // /vault/* before Vite's internal middlewares run.
      deny: ["**/vault/**"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
