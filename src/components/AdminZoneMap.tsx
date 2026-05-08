"use client";

import { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Polygon, Marker, useMapEvents, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [15, 25],
  iconAnchor: [7, 25],
});

export default function AdminZoneMap({ 
  existingZones, 
  onSaveZone 
}: { 
  existingZones: any[], 
  onSaveZone: (points: any[]) => void 
}) {
  const [points, setPoints] = useState<any[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  function MapEvents() {
    useMapEvents({
      click(e) {
        if (!isDrawing) {
          setIsDrawing(true);
          setPoints([{ lat: e.latlng.lat, lng: e.latlng.lng }]);
        } else {
          setPoints([...points, { lat: e.latlng.lat, lng: e.latlng.lng }]);
        }
      },
    });
    return null;
  }

  const finishDrawing = () => {
    if (points.length < 3) {
      alert("Debes marcar al menos 3 puntos para cerrar una zona.");
      return;
    }
    onSaveZone(points);
    setPoints([]);
    setIsDrawing(false);
  };

  const cancelDrawing = () => {
    setPoints([]);
    setIsDrawing(false);
  };

  return (
    <div className="relative w-full h-[500px] rounded-3xl overflow-hidden border-4 border-white shadow-xl">
      <MapContainer 
        center={[-34.6177, -68.3301]} 
        zoom={13} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapEvents />

        {/* Zonas existentes */}
        {existingZones.map((zone) => (
          <Polygon 
            key={zone.id} 
            positions={zone.coordinates} 
            pathOptions={{ color: zone.color, fillColor: zone.color, fillOpacity: 0.3 }}
          >
            <Tooltip permanent direction="center" className="bg-white/80 border-none shadow-none font-bold text-xs p-1 rounded">
              {zone.name} (${zone.price})
            </Tooltip>
          </Polygon>
        ))}

        {/* Zona actual en dibujo */}
        {points.length > 0 && (
          <>
            <Polygon 
              positions={points} 
              pathOptions={{ color: "#16a34a", dashArray: "5, 10" }} 
            />
            {points.map((p, i) => (
              <Marker key={i} position={[p.lat, p.lng]} icon={customIcon} />
            ))}
          </>
        )}
      </MapContainer>

      {/* Controles flotantes */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        {!isDrawing ? (
          <div className="bg-white p-4 rounded-2xl shadow-lg border border-kraft-200 max-w-xs">
            <p className="text-xs font-bold text-kraft-900 mb-1">CÓMO CREAR UNA ZONA:</p>
            <p className="text-[10px] text-kraft-600">Haz clic en el mapa para empezar a marcar los vértices de tu zona de reparto. Luego haz clic en "Cerrar Zona".</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <button 
              onClick={finishDrawing}
              className="bg-nature-600 text-white font-bold py-2 px-4 rounded-xl shadow-lg hover:bg-nature-700 transition"
            >
              Cerrar y Guardar Zona
            </button>
            <button 
              onClick={cancelDrawing}
              className="bg-red-500 text-white font-bold py-2 px-4 rounded-xl shadow-lg hover:bg-red-600 transition"
            >
              Cancelar dibujo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
