import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    // Environment
    environment: 'jsdom',

    // Setup files
    setupFiles: ['./src/test/setup.ts'],

    // Globals
    globals: true,

    // Pool configuration for better test isolation
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },

    // Coverage
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData.ts',
        'dist/',
        '.next/',
      ],
      include: ['src/**/*.{ts,tsx}']
    },

    // Test file patterns
    include: ['**/*.{test,spec}.{ts,tsx}'],

    // Exclude patterns
    exclude: [
      'node_modules',
      'dist',
      '.next',
      'coverage',
      '**/*.d.ts',
    ],

    // Reporter
    reporters: ['verbose'],

    // Test timeout
    testTimeout: 10000,
  },

  // Resolve aliases (same as tsconfig paths)
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
