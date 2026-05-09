"use client";

import { useState, useEffect } from "react";
import { Settings, Save, Percent, DollarSign, Loader2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    cashbackPercent: 5, // Se muestra como porcentaje entero (ej: 5%)
    pointValueInPeso: 1.0,
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings({
          cashbackPercent: data.cashbackPercent * 100, // Convertir 0.05 a 5 para mostrar
          pointValueInPeso: data.pointValueInPeso,
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cashbackPercent: settings.cashbackPercent / 100, // Convertir de vuelta a decimal (5 a 0.05)
          pointValueInPeso: settings.pointValueInPeso,
        }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Configuración guardada correctamente." });
      } else {
        setMessage({ type: "error", text: "Error al guardar la configuración." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error de conexión." });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-nature-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-kraft-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-kraft-100 p-4 rounded-2xl">
            <Settings className="w-8 h-8 text-kraft-900" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-bold text-kraft-900">Configuración</h1>
            <p className="text-kraft-600">Ajusta los parámetros del sistema de fidelización y puntos.</p>
          </div>
        </div>

        {message.text && (
          <div className={`p-4 rounded-xl mb-6 font-bold text-sm ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-kraft-50 p-6 rounded-2xl border border-kraft-100 space-y-6">
            <h2 className="font-bold text-lg text-kraft-900">Sistema de Puntos (Cashback)</h2>
            
            <div>
              <label className="block text-sm font-bold text-kraft-700 mb-2">
                Porcentaje de Cashback en Compras
              </label>
              <p className="text-xs text-kraft-500 mb-3">
                ¿Qué porcentaje del total de la compra se le devolverá al cliente en forma de puntos?
              </p>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Percent className="h-5 w-5 text-kraft-400" />
                </div>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={settings.cashbackPercent}
                  onChange={(e) => setSettings({ ...settings, cashbackPercent: parseFloat(e.target.value) })}
                  className="pl-12 w-full p-4 rounded-xl border border-kraft-200 focus:border-nature-600 outline-none transition font-bold"
                  required
                />
              </div>
            </div>

            <div className="pt-6 border-t border-kraft-200">
              <label className="block text-sm font-bold text-kraft-700 mb-2">
                Valor del Punto en el Carrito
              </label>
              <p className="text-xs text-kraft-500 mb-3">
                Cuando el cliente decide usar sus puntos en el checkout, ¿cuántos pesos equivale cada punto? (Ej: 1 punto = $1)
              </p>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-kraft-400" />
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={settings.pointValueInPeso}
                  onChange={(e) => setSettings({ ...settings, pointValueInPeso: parseFloat(e.target.value) })}
                  className="pl-12 w-full p-4 rounded-xl border border-kraft-200 focus:border-nature-600 outline-none transition font-bold"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-kraft-900 hover:bg-kraft-700 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Guardar Configuración
          </button>
        </form>
      </div>
    </div>
  );
}
