"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix para el icono por defecto de Leaflet en Next.js
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface LeafletMapProps {
  onLocationSelect: (lat: number, lng: number) => void;
  defaultLocation?: [number, number];
  externalLocation?: { lat: number; lng: number } | null;
}

function LocationMarker({ onLocationSelect, externalLocation }: { onLocationSelect: (lat: number, lng: number) => void, externalLocation?: { lat: number; lng: number } | null }) {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const markerRef = useRef<any>(null);
  
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  useEffect(() => {
    if (externalLocation) {
      const newPos = new L.LatLng(externalLocation.lat, externalLocation.lng);
      setPosition(newPos);
      map.flyTo(newPos, 16);
    }
  }, [externalLocation, map]);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const newPos = marker.getLatLng();
          setPosition(newPos);
          onLocationSelect(newPos.lat, newPos.lng);
        }
      },
    }),
    [onLocationSelect]
  );

  return position === null ? null : (
    <Marker 
      position={position} 
      icon={customIcon} 
      draggable={true}
      eventHandlers={eventHandlers}
      ref={markerRef}
    />
  );
}

export default function LeafletMap({ onLocationSelect, defaultLocation = [-34.6177, -68.3301], externalLocation }: LeafletMapProps) {
  // Centro aproximado de San Rafael
  const center: [number, number] = defaultLocation;

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden border border-kraft-200">
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: "100%", width: "100%", zIndex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onLocationSelect={onLocationSelect} externalLocation={externalLocation} />
      </MapContainer>
    </div>
  );
}
