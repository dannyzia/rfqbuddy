import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Backend integration tests
    include: ['src/backend/src/__tests__/**/*.test.ts'],
    // Use node environment for backend tests
    environment: 'node',
    // Global test timeout (15s for integration tests)
    testTimeout: 15_000,
    // Run serially for integration tests that may share state
    pool: 'forks',
    // Coverage configuration
    coverage: {
      provider: 'v8',
      include: [
        'src/backend/src/services/**',
        'src/backend/src/controllers/**',
        'src/backend/src/routes/**',
      ],
      reporter: ['text', 'html', 'json-summary'],
      reportsDirectory: 'coverage/backend',
    },
    // Alias to resolve backend imports
    alias: {
      '@backend': '/src/backend/src',
    },
  },
});
