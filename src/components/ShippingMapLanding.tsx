"use client";

import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

interface ShippingZone {
  id: string;
  name: string;
  price: number;
  coordinates: any;
  color?: string;
}

export default function ShippingMapLanding({ zones }: { zones: ShippingZone[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Fix para iconos de Leaflet en Next.js
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-full w-full bg-kraft-100 animate-pulse rounded-2xl"></div>;

  // Centro aproximado de San Rafael
  const center: [number, number] = [-34.6177, -68.3301];

  return (
    <div className="h-full w-full min-h-[400px] rounded-2xl overflow-hidden border-4 border-kraft-700 shadow-2xl">
      <MapContainer 
        center={center} 
        zoom={12} 
        scrollWheelZoom={false} 
        style={{ height: "100%", width: "100%", zIndex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {zones.map((zone) => {
          if (!zone.coordinates) return null;
          
          // El poligono viene como JSON string o objeto
          const positions = typeof zone.coordinates === 'string' 
            ? JSON.parse(zone.coordinates) 
            : zone.coordinates;

          return (
            <Polygon 
              key={zone.id}
              positions={positions}
              pathOptions={{ 
                color: zone.color || (zone.price === 0 ? '#6B8E23' : '#8D6E63'),
                fillColor: zone.color || (zone.price === 0 ? '#6B8E23' : '#8D6E63'),
                fillOpacity: 0.3
              }}
            >
              <Popup>
                <div className="text-center">
                  <p className="font-bold text-kraft-900">{zone.name}</p>
                  <p className="text-nature-600 font-bold">
                    {zone.price === 0 ? "Envío GRATIS" : `Envío: $${zone.price}`}
                  </p>
                </div>
              </Popup>
            </Polygon>
          );
        })}
      </MapContainer>
    </div>
  );
}
