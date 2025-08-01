import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // vueDevTools(),
  ],
  server :{
    host: true,
    proxy: {
      // ✅ /equip으로 시작하는 요청은 localhost:8081로 프록시
      '/equip': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        rewrite: (path) => path, // 경로 그대로 유지
      },
      '/tus': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        rewrite: (path) => path, // 경로 그대로 유지
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log(`[Proxy] ${req.method} ${req.url} -> ${proxyReq.getHeader('host')}${proxyReq.path}`);
          });
        }
      },
    },
  },
  resolve: {
    alias: {
     // '@': fileURLToPath(new URL('./src', import.meta.url))

      '@': path.resolve(__dirname, 'src')
    },
  },
})
