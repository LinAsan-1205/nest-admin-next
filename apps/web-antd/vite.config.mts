import { defineConfig } from '@vben/vite-config';

import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      plugins: [
        Components({
          dirs: ['src/components'],
          dts: 'src/types/components.d.ts',
          extensions: ['vue'],
          include: [/\.vue$/, /\.vue\?vue/],
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
            target: 'http://127.0.0.1:7002/api',
            ws: true,
          },
        },
      },
    },
  };
});
