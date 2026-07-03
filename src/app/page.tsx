"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Moon } from "@/components/icons";

// Splash screen inicial. Muestra el logo de NocturnaSounds y redirige al home
// tras 3 segundos, simulando una pantalla de carga de app móvil.
export default function WelcomeScreen() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/home");
    }, 3000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-32 h-32">
        <Moon width="100%" height="100%" />
      </div>
    </div>
  );
}
