import { defineConfig, UserConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()] as UserConfig['plugins'],
  test: {
    globals: true,
    environment: 'jsdom'
  }
});
