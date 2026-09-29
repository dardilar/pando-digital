// @ts-check
import { defineConfig, envField } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  // Sitio estático (el default de Astro): todo se convierte en HTML en el build.
  // React se usa SOLO en las islas (componentes .tsx montados con client:*).
  // EXCEPCIÓN: las rutas con `export const prerender = false` (hoy solo
  // src/pages/api/contact.ts) corren en el servidor en cada petición. El
  // adaptador de Vercel es quien las convierte en Vercel Functions.
  integrations: [react()],
  adapter: vercel(),

  // astro:env — variables con esquema. `context: 'server'` + `access: 'secret'`
  // garantiza que NUNCA lleguen al navegador y que se lean en tiempo de
  // ejecución (no se incrustan en el build como las PUBLIC_).
  env: {
    schema: {
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      CONTACT_TO_EMAIL: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
});
