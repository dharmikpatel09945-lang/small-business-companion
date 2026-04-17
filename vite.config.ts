import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

import { spawn } from "child_process";

const backendStarter = () => ({
  name: "backend-starter",
  configureServer() {
    console.log("Starting backend server alongside Vite...");
    const backend = spawn(process.execPath, ["run", "backend/index.ts"], {
      stdio: "pipe",
      shell: false,
    });
    
    backend.stdout?.on('data', (data) => console.log(`[Backend] ${data.toString()}`));
    backend.stderr?.on('data', (data) => console.error(`[Backend ERROR] ${data.toString()}`));
    backend.on("error", (err) => console.error("[Backend FATAL]:", err));
    backend.on("exit", (code) => console.log(`[Backend] Process exited with code ${code}`));
    
    // Kill backend if Vite stops
    process.on("exit", () => backend.kill());
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/api/auth/me": {
        target: "http://localhost:3001",
        changeOrigin: true,
        timeout: 5000,
        proxyTimeout: 5000,
      }
    },
  },
  plugins: [
    react(), 
    mode === "development" && componentTagger(),
    mode === "development" && backendStarter()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
