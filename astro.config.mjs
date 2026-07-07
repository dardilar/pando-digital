// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // Sitio estático (el default de Astro): todo se convierte en HTML en el build.
  // React se usa SOLO en las islas (componentes .tsx montados con client:*).
  integrations: [react()],
});
