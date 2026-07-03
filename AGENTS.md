# NocturnaSounds — Guía para el equipo de desarrollo

## Visión del producto

NocturnaSounds es un reproductor de sonidos ambientales que se mezclan entre sí, permitiendo crear paisajes sonoros personalizados. Inspirado en el reproductor de sonidos de ambiente de Apple. Un **Simple Lovable Concept (SLC)**: funcional, estético, mínimo viable. Cada decisión técnica debe priorizar la simplicidad y el valor para el usuario por sobre la complejidad innecesaria.

---

## Stack técnico

| Capa      | Tecnología                                          |
| --------- | --------------------------------------------------- |
| Frontend  | Next.js 15 (App Router), React 19, TypeScript 5     |
| Estilos   | TailwindCSS v4, Geist Sans/Mono (next/font)         |
| Paquetes  | pnpm 10 (shamefully-hoist=true)                     |
| Estado    | Context API (AudioPlayerContext + UIContext)         |
| Audio     | Web Audio API (hook personalizado `useWebAudioPlayer`) |
| Backend   | Ninguno — datos estáticos en `moods.ts`, audios locales en `public/audio/` |

---

## Principios generales de desarrollo

1. **Simple > Complejo** — No agregues abstracciones, librerías o patrones que no sean estrictamente necesarios hoy.
2. **Consistencia > Creatividad** — Sigue los patrones existentes del código. No introduzcas nuevos estilos o arquitecturas sin discutirlo antes.
3. **Funcional > Perfecto** — El producto debe funcionar primero. La optimización y refactorización se hace cuando hay un problema real, no por prevención.
4. **Discutir antes de implementar** — Cualquier cambio que afecte la arquitectura, agregue dependencias o modifique el flujo de datos debe discutirse en equipo primero.

---

## Fases del proyecto

El proyecto avanza por fases. Cada fase tiene un objetivo claro y tareas definidas por rol. Al terminar una fase se actualiza este documento y se notifica al equipo.

### Fase actual: 1 — Simplificación y migración a multi-track

**Objetivo:** Eliminar dependencias externas (Supabase), remover escenas de video, migrar audios a local, y rediseñar la UI como un grid de sonidos con reproducción independiente y mezcla en vivo.

---

## Roles y responsabilidades

### Backend

**Alcance:** Datos estáticos, archivos de audio, lógica de datos, modelo de datos.

**Directrices:**
- No hay backend. El producto es 100% frontend. Datos estáticos en `src/data/moods.ts`.
- Los archivos de audio residen en `public/audio/` y se sirven estáticamente.
- No hay API routes, no hay base de datos, no hay autenticación, no hay servicios externos.
- Si en el futuro se requiere backend (ej. usuarios, playlists), se discute en equipo primero.

### Frontend

**Alcance:** Páginas, componentes, estilos, animaciones, experiencia de usuario, audio playback.

**Directrices:**
- Mantén la estética visual del producto: fondo oscuro (`#121212`), glassmorphism (`backdrop-blur-sm`, bordes `border-[#333]`), íconos en SVG, texto neutro (`text-neutral-100/200/300`).
- Respeta los patrones de componentes existentes:
  - Componentes con `"use client"` solo cuando sea necesario.
  - Props tipadas con interfaces locales.
  - Iconos como componentes React que renderizan SVG inline.
  - Clases TailwindCSS sin CSS modules ni styled-components.
- Responsive design obligatorio: usa breakpoints `sm:`, `md:`, `lg:`.
- La paleta de color es oscura y nocturna. No introduzcas colores brillantes o claros sin discusión.
- Los íconos se importan desde `@/components/icons` (barrel export).
- El hook `useWebAudioPlayer` es la única fuente de verdad para el audio. No crees reproductores alternativos.
- El Context API es suficiente para el estado global. No agregues Redux, Zustand, Jotai, etc.
- El reproductor debe soportar múltiples tracks reproduciéndose simultáneamente (mezcla en vivo).

### QA

**Alcance:** Pruebas funcionales, reporte y corrección de bugs, tests automatizados, regresión visual.

**Directrices:**
- Tu objetivo es asegurar calidad sin modificar la lógica fundamental del backend.
- Puedes crear y modificar tests, corregir bugs, mejorar validaciones y edge cases.
- No reescribas componentes completos ni cambies la arquitectura del backend sin consultar al equipo.
- Los bugs se corrigen en la capa donde ocurren:
  - Bug visual/UX → frontend
  - Bug de datos/lógica → datos estáticos
  - Bug de audio → hook `useWebAudioPlayer`
- Cobertura inicial esperada:
  - Tests unitarios para hooks (`useWebAudioPlayer`)
  - Tests de componentes
  - Tests de integración para flujos críticos (selección de sonido → play → mezcla)
- Usa el framework de testing que el equipo decida (Vitest recomendado por compatibilidad con Next.js 15).
- Reporta bugs con: descripción, pasos para reproducir, comportamiento esperado vs actual, evidencia (screenshot/log).

---

## Flujo de trabajo con Git

1. **Ramas:** `main` (producción), `develop` (integración), `feat/<nombre>` (features), `fix/<nombre>` (bugs), `chore/<nombre>` (tareas técnicas).
2. **Commits:** Mensajes en español o inglés, descriptivos y en presente imperativo. Prefijo opcional: `feat:`, `fix:`, `chore:`, `refactor:`, `test:`.
3. **PRs:** Antes de abrir un PR, asegúrate de que:
   - `pnpm run lint` pase sin errores.
   - `pnpm run build` compile correctamente.
   - Los tests nuevos y existentes pasen.
4. **Code review:** Toda PR necesita al menos una aprobación. El reviewer verifica:
   - Sigue los principios de este documento.
   - No introduce complejidad innecesaria.
   - Respeta la estética y patrones del frontend.
   - Los tests cubren el cambio adecuadamente.

---

## Comunicación y toma de decisiones

- Ante una duda técnica, primero revisa el código existente. Lo más probable es que el patrón ya esté definido.
- Si un cambio requiere más de 2 horas de implementación, discútelo antes en el equipo.
- Las decisiones de arquitectura se documentan brevemente en el `CHANGELOG.md` o en la descripción del PR.
- No hay decisiones unilaterales de backend, frontend o QA que afecten a otro rol sin coordinación.

---

## Checklist antes de cada PR

- [ ] ¿Sigue los patrones existentes del código?
- [ ] ¿Agrega alguna dependencia nueva? Si es así, ¿es realmente necesaria?
- [ ] ¿Tiene tests (para QA y features relevantes)?
- [ ] `pnpm run lint` → sin errores
- [ ] `pnpm run build` → sin errores
- [ ] ¿La UI es responsive y sigue la paleta oscura?
- [ ] ¿El cambio está dentro del alcance de mi rol?
