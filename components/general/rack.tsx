"use client";
import Image from "next/image";

const Niveles = [
  { label: "NIVEL 13", seleccionado: true, finalizado: true },
  { label: "NIVEL 12", seleccionado: true, finalizado: false },
  { label: "NIVEL 11", seleccionado: false, finalizado: null },
  { label: "NIVEL 10", seleccionado: false, finalizado: null },
  { label: "NIVEL 9", seleccionado: true, finalizado: true },
  { label: "NIVEL 8", seleccionado: true, finalizado: false },
  { label: "NIVEL 7", seleccionado: false, finalizado: null },
  { label: "NIVEL 6", seleccionado: false, finalizado: null },
  { label: "NIVEL 5", seleccionado: true, finalizado: true },
  { label: "NIVEL 4", seleccionado: true, finalizado: false },
  { label: "NIVEL 3", seleccionado: false, finalizado: null },
  { label: "NIVEL 2", seleccionado: false, finalizado: null },
  { label: "NIVEL 1", seleccionado: true, finalizado: true },
];

const getColor = (seleccionado: boolean, finalizado: boolean | null) => {
  if (seleccionado && finalizado) return "bg-green/30 border-green border";
  if (seleccionado && !finalizado) return "bg-red/30 border-red border";
  return "bg-background6/50 border-background border";
};

export default function Home() {
  return (
    <div className="relative w-full max-w-65 aspect-3/4">
      <Image
        src="/general/RACK.png"
        alt="rack"
        fill
        className="object-contain"
        unoptimized
      />
      <div className="flex flex-col items-center justify-center gap-[0.43rem] pt-2 w-full h-full">
        {Niveles.map((nivel, index) => (
          <div
            key={index}
            className={`z-200 w-[85%] h-auto rounded-md px-2 flex items-center justify-center ${getColor(nivel.seleccionado, nivel.finalizado)}`}
            style={{
              top: `${20 + (index % 5) * 15}%`,
              left: `${10 + Math.floor(index / 5) * 20}%`,
            }}
          >
            {nivel.label}
          </div>
        ))}
      </div>
    </div>
  );
}
