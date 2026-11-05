import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,

    proxy: {
      "/api": {
        target: "https://dsohu6n1v0a1o.cloudfront.net",
        changeOrigin: true,
        secure: true,
      },

      "/oauth2": {
        target: "https://dsohu6n1v0a1o.cloudfront.net",
        changeOrigin: true,
        secure: true,
      },

      "/login/oauth2": {
        target: "https://dsohu6n1v0a1o.cloudfront.net",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});