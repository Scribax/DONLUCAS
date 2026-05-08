"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";

// Importación dinámica apagando el Server-Side Rendering
const DynamicMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full bg-kraft-50 rounded-2xl border border-kraft-200 flex flex-col items-center justify-center text-kraft-700 animate-pulse">
      <MapPin className="w-12 h-12 mb-4 opacity-50" />
      <p>Cargando mapa interactivo...</p>
    </div>
  ),
});

interface MapSelectorProps {
  onLocationSelect: (lat: number, lng: number) => void;
  externalLocation?: { lat: number; lng: number } | null;
}

export default function MapSelector({ onLocationSelect, externalLocation }: MapSelectorProps) {
  return (
    <div className="w-full h-[400px]">
      <DynamicMap onLocationSelect={onLocationSelect} externalLocation={externalLocation} />
      <p className="text-sm text-kraft-700 mt-2 flex flex-col gap-1">
        <span className="flex items-center gap-2 font-bold text-nature-600">
          <MapPin className="w-4 h-4" />
          No encontramos esa dirección. Intenta buscar solo el nombre de la calle (sin el número) y luego arrastra el pin manualmente.
        </span>
        ¡Asegúrate de que el pin esté exactamente sobre tu casa!
      </p>
    </div>
  );
}
