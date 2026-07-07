# Pando Digital — sitio web de la consultoría de Daniel

Landing page en Astro portada desde un diseño de Claude Design. **Es también una
sesión de tutoría**: Daniel está aprendiendo (JS moderado; React/Astro/TS
principiante) y pidió explícitamente este formato:

> **Concepto primero → código después → checkpoint de comprensión antes de
> avanzar.** Explicar el "porqué" de cada decisión. Todo en español. Las pausas
> para confirmar comprensión son intencionales — no avanzar sin su respuesta.

## Stack y convenciones

- **Astro 7 + TypeScript strict**, sitio 100% estático salvo una isla React
  (`src/components/react/ContactForm.tsx`, montada con `client:load`).
- **pnpm** siempre (elegido por seguridad; los build-scripts se aprueban en
  `pnpm-workspace.yaml`). Comandos: `pnpm dev` / `build` / `preview` /
  `pnpm exec astro check`.
- **NO instalar React Router ni Zustand** — decidido: innecesarios aquí.
- Tokens de diseño en `src/styles/global.css` (`--accent` terracota #E8663D,
  `--secondary` verde #2F5D4F, `--cream` #FFFBF5…). Los componentes usan
  `var(--token)`, nunca hex directos.
- Contenido separado de la presentación: textos/datos en `src/data/*.ts` con
  interfaces TS (`packages.ts`, `projects.ts`, `faqs.ts`).
- Diseño de referencia (NO tocar): `pandodigital/Landing Page.dc.html` y
  `pandodigital/uploads/`. Plan original:
  `~/.claude/plans/estoy-construyendo-el-sitio-magical-flute.md`.
- Commits en español, con mensaje de qué se aprendió/construyó.

## Estado (actualizado 2026-07-07)

Pasos 1–9 del plan **completos**. El sitio entero funciona y está verificado
en local:

1. ✅ Base: scaffold, tokens, `BaseLayout.astro`, favicon (monograma).
2. ✅ `Logo.astro` (props tipadas, escala por `size`) + `Header.astro` sticky.
3. ✅ `Hero.astro` + `HeroAnimation.astro` (marquee 3D portado del iframe;
   keyframes en `<style is:global>` porque se referencian desde estilos inline).
4. ✅ `About.astro` con `astro:assets` (foto 2 MB → 34 KB WebP; requirió
   `pnpm add sharp`).
5. ✅ `Services.astro` — datos en `packages.ts`, variante `featured` con
   `class:list`.
6. ✅ `Portfolio.astro` (placeholders rayados, textos traducidos),
   `Faq.astro` (`<details>/<summary>` nativo, ícono +/– con `details[open]`),
   `Footer.astro` (año calculado en build — trampa didáctica ya explicada).
7. ✅ Isla React v1: `useState`, inputs controlados, `client:load`.
8. ✅ Formulario v2: validación con mensajes en español, máquina de estados
   `idle → sending → success`, `fetch` a Web3Forms, honeypot `botcheck`.
   La clave vive en `.env` (`PUBLIC_WEB3FORMS_KEY`, ya configurada por Daniel;
   sin clave el form corre en modo simulado).

9. ✅ **Verificación end-to-end** (2026-07-07): `astro check` y build limpios,
   repaso visual contra el diseño, formulario real probado (errores + correo
   recibido), `prefers-reduced-motion` OK. Se añadió **menú hamburguesa móvil**
   en `Header.astro`: `<details>` como interruptor + selector de hermano
   `.menu-toggle[open] + nav`, media query ≤720px, nav como panel `absolute`,
   mini `<script>` que cierra el menú al hacer clic en un link.

### Pendiente

- ⬜ **Ajustes de contenido** que Daniel quiere hacer antes del deploy
  (textos en `src/data/*.ts` y componentes de sección; pendiente que liste
  cuáles).
10. ⬜ **Deploy a Vercel**: output estático (sin adapter). Configurar
    `PUBLIC_WEB3FORMS_KEY` también en Vercel (`vercel env`). Preview primero,
    producción cuando Daniel apruebe.
- ⬜ Futuro: imágenes reales del portafolio (entran por `src/data/projects.ts`
  + `astro:assets`), dominio pandodigital.co, correo hola@pandodigital.co.

## Conceptos que Daniel ya dominó (no re-explicar desde cero)

Build vs navegador (frontmatter vs `<script>` — le costó 2 intentos, ya lo
tiene sólido); tokens CSS; props tipadas + interfaces; estilos scoped y su
mecanismo (`data-astro-cid`); por qué `is:global` para keyframes referenciados
inline; `src/assets` vs `public/`; separar datos de presentación; render
condicional `{cond && ...}` y `class:list`; `<details>/<summary>` antes que JS;
islas e hidratación (`<astro-island>`, costo de React 184 KB); `useState` e
inputs controlados; `e.preventDefault()`; deshabilitar controles durante
operaciones en vuelo (checkpoint del Paso 8 respondido bien: clics repetidos =
fetches duplicados). Recién vistos (afianzar con preguntas si surge la
ocasión): `async/await` + `fetch`, tipos unión para máquinas de estado,
funciones que devuelven funciones (`field(setter)`), variables `PUBLIC_` en
`.env` (y que se incrustan literalmente en el bundle), honeypot, media queries
(`max-width`, `prefers-reduced-motion`), selector de hermano adyacente `+`,
`<details>` como interruptor de estado para CSS, dev vs build de producción
(verificar siempre sobre `pnpm preview`), caché del navegador / recarga dura
(vivió un bug de CSS viejo en caché y lo resolvió con Ctrl+Shift+R).

## Checkpoints

Ninguno pendiente. El del Paso 8 (envíos duplicados sin `disabled`) y el del
menú móvil (qué pasaría sin `position: absolute` en el nav) fueron respondidos
correctamente por Daniel el 2026-07-07.
