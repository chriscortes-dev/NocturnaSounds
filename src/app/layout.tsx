import type { Metadata } from "next";
import "./globals.css";
import { AudioPlayerProvider } from "@/context/AudioPlayerContext";

export const metadata: Metadata = {
  title: "NocturnaSounds",
  description: "Explora, combina y deja que el sonido te guíe.",
};

// Layout raíz. Envuelve toda la app en el provider de audio para que el estado
// de reproducción sea global.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        <AudioPlayerProvider>
          {children}
        </AudioPlayerProvider>
      </body>
    </html>
  );
}
