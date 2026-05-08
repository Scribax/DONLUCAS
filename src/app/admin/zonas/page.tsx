"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { Trash2, Map as MapIcon, Plus, X } from "lucide-react";

const AdminZoneMap = dynamic(() => import("@/components/AdminZoneMap"), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-kraft-50 rounded-3xl animate-pulse flex items-center justify-center">Cargando mapa interactivo...</div>
});

export default function AdminZonasPage() {
  const [zones, setZones] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newZonePoints, setNewZonePoints] = useState<any[]>([]);
  const [zoneInfo, setZoneInfo] = useState({ name: "", price: "", color: "#166534" });

  useEffect(() => {
    fetch("/api/shipping-zones")
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.zones)) {
          setZones(data.zones);
        } else {
          console.error("API did not return zones array:", data);
          setZones([]);
        }
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setZones([]);
      });
  }, []);

  const handleStartZone = (points: any[]) => {
    setNewZonePoints(points);
    setIsAdding(true);
  };

  const saveZone = async () => {
    if (!zoneInfo.name || !zoneInfo.price) {
      alert("Por favor ponle un nombre y precio a la zona.");
      return;
    }

    try {
      const res = await fetch("/api/shipping-zones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...zoneInfo,
          coordinates: newZonePoints
        })
      });

      if (!res.ok) throw new Error("Error al guardar");
      
      const saved = await res.json();
      setZones([...zones, saved]);
      setIsAdding(false);
      setNewZonePoints([]);
      setZoneInfo({ name: "", price: "", color: "#166534" });
    } catch (err) {
      alert("Error al guardar la zona");
    }
  };

  const deleteZone = async (id: string) => {
    if (!confirm("¿Eliminar esta zona de envío?")) return;
    try {
      await fetch(`/api/shipping-zones?id=${id}`, { method: "DELETE" });
      setZones(zones.filter(z => z.id !== id));
    } catch (err) {
      alert("Error al eliminar");
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-kraft-100 flex justify-between items-center">
        <div>
          <h1 className="font-serif text-3xl font-bold text-kraft-900">Zonas de Envío</h1>
          <p className="text-kraft-600">Dibuja polígonos en el mapa para definir áreas y precios de entrega.</p>
        </div>
        <MapIcon className="w-10 h-10 text-nature-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Mapa */}
        <div className="lg:col-span-2">
          <AdminZoneMap existingZones={zones} onSaveZone={handleStartZone} />
        </div>

        {/* Lista y Formulario */}
        <div className="space-y-6">
          {isAdding && (
            <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-nature-600 animate-in slide-in-from-right duration-300">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg text-nature-800">Nueva Zona Detectada</h2>
                <button onClick={() => setIsAdding(false)}><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-kraft-500 mb-1 uppercase">Nombre del Sector</label>
                  <input 
                    type="text" 
                    placeholder="Ej: Centro / Cuadro Nacional"
                    value={zoneInfo.name}
                    onChange={e => setZoneInfo({...zoneInfo, name: e.target.value})}
                    className="w-full p-3 border border-kraft-200 rounded-xl outline-none focus:ring-2 focus:ring-nature-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-kraft-500 mb-1 uppercase">Costo de Envío ($)</label>
                  <input 
                    type="number" 
                    placeholder="0 para envío gratis"
                    value={zoneInfo.price}
                    onChange={e => setZoneInfo({...zoneInfo, price: e.target.value})}
                    className="w-full p-3 border border-kraft-200 rounded-xl outline-none focus:ring-2 focus:ring-nature-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-kraft-500 mb-1 uppercase">Color en Mapa</label>
                  <input 
                    type="color" 
                    value={zoneInfo.color}
                    onChange={e => setZoneInfo({...zoneInfo, color: e.target.value})}
                    className="w-full h-10 p-1 rounded-lg cursor-pointer"
                  />
                </div>
                <button 
                  onClick={saveZone}
                  className="w-full bg-nature-600 text-white font-bold py-3 rounded-xl hover:bg-nature-700 transition shadow-md"
                >
                  Confirmar y Guardar Sector
                </button>
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-kraft-100">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              Sectores Definidos ({zones.length})
            </h2>
            <div className="space-y-3">
              {zones.map(zone => (
                <div key={zone.id} className="flex items-center justify-between p-3 rounded-xl border border-kraft-50 hover:bg-kraft-50 transition group">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: zone.color }}></div>
                    <div>
                      <p className="font-bold text-sm text-kraft-900">{zone.name}</p>
                      <p className="text-xs text-nature-600 font-bold">${zone.price}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteZone(zone.id)}
                    className="p-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {zones.length === 0 && !isAdding && (
                <p className="text-xs text-kraft-400 italic text-center py-4">Dibuja tu primer sector en el mapa para empezar.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
