import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, 
    environment: 'jsdom', 
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: './vitest.setup.ts',
    coverage: {
      provider: 'v8', 
      reporter: ['text', 'html'], 
      reportsDirectory: './coverage',
      include: ['src/**/*.{js,jsx,ts,tsx}'], 
      exclude: [
        'src/**/vitest.config.ts',
        'src/**/*.{test,spec}.{js,js,ts,tsx}',
        'src/**/*.d.ts', 
        'src/setupTests.{js,ts}',
        'src/main.tsx',
      ],
      thresholds: {
        statements: 80, 
        branches: 50, 
        functions: 50, 
        lines: 50, 
      },
    },
  },
});
