import { defineConfig } from '@vben/vite-config';
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      plugins: [
        Components({
          extensions: ['vue'],
          dts: 'src/types/components.d.ts',
          include: [/\.vue$/, /\.vue\?vue/],
          dirs: ['src/components'],
          resolvers: [
            AntDesignVueResolver({
              importStyle: false, // css in js
            }),
          ],
        }),
      ],
      server: {
        port: 8099,
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // mock代理目标地址
            target: 'http://localhost:5320/api',
            ws: true,
          }
        },
      },
    },
  };
});
