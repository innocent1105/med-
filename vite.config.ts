import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    // Standard Vite config options go here if needed
    server: {
      port: 3000,
    }
  }
});