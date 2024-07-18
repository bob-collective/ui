import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
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
    optimizeDeps: {
      esbuildOptions: {
        // Enable esbuild polyfill plugins
        plugins: [
          NodeGlobalsPolyfillPlugin({
            process: true
          }),
          NodeModulesPolyfillPlugin()
        ]
      }
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        '/dynamic-api': {
          target: env.VITE_DYNAMIC_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/dynamic-api/, '')
        },
        '/fusion-api': {
          target: env.VITE_FUSION_API,
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
