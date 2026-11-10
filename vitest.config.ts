import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

/* A `@/*` alias megegyezik a tsconfig.json paths beállításával
   (`@/*` → a projekt gyökere), hogy a lib tesztek is feloldják. */
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
  // A lib tesztek tiszta számítások — nincs szükség a projekt PostCSS/
  // Tailwind feldolgozására. Üres postcss-konfig felülírja az automatikus
  // felismerést (különben a Tailwind v4 plugin betöltése elhasal).
  css: { postcss: {} },
  test: {
    environment: 'node',
    include: ['lib/**/*.test.ts'],
  },
});
