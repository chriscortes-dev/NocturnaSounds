# NocturnaSounds 🌙🎵

Reproductor de sonidos ambientales con mezcla en vivo. Inspirado en el reproductor de sonidos de ambiente de Apple.

## ✨ Funcionalidades

- **Grid de sonidos**: 6 sonidos ambientales (lluvia, fogata, trueno, océano, río, viento)
- **Reproducción independiente**: cada track tiene su propio control de play/pausa y volumen
- **Mezcla en vivo**: múltiples sonidos se reproducen simultáneamente y se mezclan en tiempo real
- **MiniPlayer persistente**: control global con timer configurable por sonido
- **Responsive**: desktop y dispositivos móviles

## 🛠 Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 15 (App Router), React 19, TypeScript 5 |
| Estilos | TailwindCSS 4, Geist Sans/Mono |
| Paquetes | pnpm |
| Estado | Context API (AudioPlayerContext + UIContext) |
| Audio | Web Audio API (useWebAudioPlayer) |
| Backend | Ninguno — datos estáticos, audios locales |

## 📂 Estructura

```
src/
├── app/          → Páginas y layouts
├── components/   → SoundCarousel, MiniPlayer, icons
├── context/      → AudioPlayerContext
├── data/         → moods.ts (fuente única de datos)
├── hooks/        → useWebAudioPlayer (Web Audio API)
├── test/         → Tests con Vitest
public/audio/     → Archivos de audio locales
```

## 🚀 Comandos

```bash
pnpm install      # Instalar dependencias
pnpm run dev      # Desarrollo
pnpm run build    # Build producción
pnpm run lint     # ESLint
pnpm run test     # Tests
```

## 🎯 Concepto

Simple Lovable Concept (SLC): funcional, estético, mínimo viable. Sin backend, sin autenticación, sin servicios externos.
