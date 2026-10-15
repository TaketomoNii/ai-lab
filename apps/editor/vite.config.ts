import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'

// https://vitejs.dev/config/
export default defineConfig({
  // Slidea: apps/web の /editor 配下で配信する
  base: '/editor/',
  plugins: [
    // Slidea: apps/web（Next.js）経由で開発サーバーにアクセスすると、
    // `?vue&type=style&lang.scss` のような値なしクエリが `lang.scss=` に書き換えられ、
    // Vite が CSS として処理できなくなる。値なしに戻してから Vite に渡す。
    {
      name: 'slidea-normalize-proxied-query',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (req.url?.includes('?')) req.url = req.url.replace(/([?&][^=&]+)=(?=&|$)/g, '$1')
          next()
        })
      },
    },
    vue(),
    Components({
      dirs: [],
      resolvers: [
        IconsResolver({
          prefix: 'i',
          customCollections: ['custom'],
        }),
      ],
    }),
    Icons({
      compiler: 'vue3',
      autoInstall: false, 
      customCollections: {
        custom: FileSystemIconLoader('src/assets/icons'),
      },
      scale: 1,
      defaultClass: 'i-icon',
    }),
  ],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    // Slidea: 通常は apps/web（http://localhost:3000/editor）経由で開く。
    // Vite を直接開いた場合も API を使えるよう apps/web へ転送する
    proxy: {
      '/api': {
        target: process.env.SLIDEA_WEB_URL ?? 'http://localhost:3000',
        changeOrigin: false,
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import '@/assets/styles/variable.scss';
          @import '@/assets/styles/mixin.scss';
        `
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
