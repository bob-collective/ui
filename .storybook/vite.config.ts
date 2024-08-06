// @ts-ignore
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
// @ts-ignore
import { nodePolyfills } from 'vite-plugin-node-polyfills';

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
    plugins: [react(), nodePolyfills()]
  };
});
