import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    proxy: {
      "/api/ai": {
        target: "https://api.groq.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ai/, ""),
        headers: {
          "Authorization": "Bearer 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",
        },
      },
    },
  },
})