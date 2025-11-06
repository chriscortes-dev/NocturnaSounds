import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AudioPlayerProvider } from "@/context/AudioPlayerContext";
import { UIProvider } from "@/context/UIContext"; // 👈 importar tu nuevo contexto global

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NocturnaSounds",
  description: "Explora, combina y deja que el sonido te guíe.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AudioPlayerProvider>
          <UIProvider>
            {children}
          </UIProvider>
        </AudioPlayerProvider>
      </body>
    </html>
  );
}
