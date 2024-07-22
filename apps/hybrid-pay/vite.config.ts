import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

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
      }),
      nodePolyfills({
        // To add only specific polyfills, add them here. If no option is passed, adds all polyfills
        include: ['path'],
        // To exclude specific polyfills, add them to this list. Note: if include is provided, this has no effect
        exclude: [
          'http' // Excludes the polyfill for `http` and `node:http`.
        ],
        // Whether to polyfill specific globals.
        globals: {
          Buffer: true, // can also be 'build', 'dev', or false
          global: true,
          process: true
        },
        // Override the default polyfills for specific modules.
        overrides: {
          // Since `fs` is not supported in browsers, we can use the `memfs` package to polyfill it.
          fs: 'memfs'
        },
        // Whether to polyfill `node:` protocol imports.
        protocolImports: true
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
        '/dynamic-api': {
          target: env.VITE_DYNAMIC_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/dynamic-api/, '')
        }
      }
    }
  };
});
