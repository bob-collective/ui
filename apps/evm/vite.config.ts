import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import wasm from 'vite-plugin-wasm';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      nodePolyfills(),
      wasm(),
      sentryVitePlugin({
        authToken: env.VITE_SENTRY_AUTH_TOKEN,
        org: 'distributed-crafts',
        project: 'bob-ui'
      })
    ],
    build: {
      target: 'esnext',
      sourcemap: true // Source map generation must be turned on
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        '/onramp-api': {
          target: env.VITE_ONRAMP_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/onramp-api/, '')
        },
        '/btc-api': {
          target: env.VITE_BTC_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/btc-api/, '')
        }
      }
    }
  };
});
