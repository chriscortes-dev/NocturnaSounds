"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Moon } from "@/components/icons";

export default function WelcomeScreen() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/home"); // Redirige después de 3s
    }, 3000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-6">Escucha lo que sientes</h1>
      <div className="w-32 h-32">
        <Moon width="100%" height="100%" />
      </div>
    </div>
  );
}
