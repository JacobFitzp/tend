import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./app/lib/__tests__/setup.ts'],
    include: ['app/**/__tests__/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['app/lib/**'],
    },
  },
});
