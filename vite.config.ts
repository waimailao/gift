import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import viteBabel from 'vite-plugin-babel'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig(({ mode }) => {
  const plugins = [
    vue(),
    viteBabel(),
    nodePolyfills({
      include: ['path', 'stream', 'util', 'console'],
      exclude: ['http'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      overrides: {
        fs: 'memfs',
      },
      protocolImports: true,
    }),
  ]

  return {
    base: '/',
    build: {
      target: 'es2020',
      // need sourcemap for sentry
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia', 'vant'],
          },
        },
      },
    },
    plugins,
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src'),
        'lodash': 'lodash-es',
        'md5': 'md5',
      },
    },
  }
})
