import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'MODO - کوچ هوشمند',
        short_name: 'MODO',
        description: 'ساختار، وضوح، رشد',
        start_url: '/',
        display: 'standalone',
        background_color: '#0F0F14',
        theme_color: '#6C63FF',
        dir: 'rtl',
        lang: 'fa',
        orientation: 'portrait',
        icons: [
          {
            src: '/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        // کش کردن فایل‌های استاتیک
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        // صفحات آفلاین
        runtimeCaching: [
          {
            // کش فونت وزیرمتن
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'font-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // ۱ سال
              },
            },
          },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})