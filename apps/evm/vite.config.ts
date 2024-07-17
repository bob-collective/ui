import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import wasm from 'vite-plugin-wasm';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV)
    },
    build: {
      target: 'esnext',
      sourcemap: true // Source map generation must be turned on
    },
    plugins: [
      react(),
      nodePolyfills(),
      wasm(),
      sentryVitePlugin({
        org: 'distributed-crafts',
        project: 'bob-ui',
        applicationKey: 'bob-ui-application-key',
        authToken: process.env.SENTRY_AUTH_TOKEN
      })
    ],
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
