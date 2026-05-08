"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { ShoppingCart, MapPin, CreditCard, ChevronRight, Loader2, Star } from "lucide-react";
import { useRouter } from "next/navigation";

interface ShippingZone {
  id: string;
  name: string;
  price: number;
}

export default function CheckoutForm({ shippingZones }: { shippingZones: ShippingZone[] }) {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [selectedZone, setSelectedZone] = useState<ShippingZone | null>(null);
  const [loading, setLoading] = useState(false);
  const [usePoints, setUsePoints] = useState(false);
  
  // Datos del cliente
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: ""
  });

  const subtotal = getTotalPrice();
  const shippingCost = selectedZone?.price || 0;
  const pointsDiscount = usePoints ? 500 : 0; // Ejemplo: 500 pesos de descuento por puntos
  const total = subtotal + shippingCost - pointsDiscount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedZone) return alert("Por favor seleccioná una zona de envío");
    
    setLoading(true);
    try {
      // Aquí irá la llamada a tu API de MercadoPago
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customer: formData,
          zoneId: selectedZone.id,
          shippingCost,
          totalAmount: total,
          paymentMethod: "MERCADOPAGO",
          usePoints
        })
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url; // Redirigir a MercadoPago
      }
    } catch (error) {
      console.error("Error al procesar el pago", error);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
        <button onClick={() => router.push("/productos")} className="text-nature-600 font-bold">
          Volver a la tienda
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Formulario */}
      <div className="space-y-8">
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-nature-600" /> Datos de Entrega
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <input 
              type="text" 
              placeholder="Nombre Completo" 
              className="w-full p-4 rounded-xl border border-gray-200 focus:border-nature-600 outline-none transition"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full p-4 rounded-xl border border-gray-200 focus:border-nature-600 outline-none transition"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-4">
              <input 
                type="tel" 
                placeholder="Teléfono" 
                className="w-full p-4 rounded-xl border border-gray-200 focus:border-nature-600 outline-none transition"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
              <select 
                className="w-full p-4 rounded-xl border border-gray-200 focus:border-nature-600 outline-none transition"
                onChange={(e) => setSelectedZone(shippingZones.find(z => z.id === e.target.value) || null)}
                required
              >
                <option value="">Zona de Envío</option>
                {shippingZones.map(zone => (
                  <option key={zone.id} value={zone.id}>{zone.name} (+${zone.price})</option>
                ))}
              </select>
            </div>
            <input 
              type="text" 
              placeholder="Dirección exacta" 
              className="w-full p-4 rounded-xl border border-gray-200 focus:border-nature-600 outline-none transition"
              required
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>
        </section>

        {/* Puntos */}
        <section className="bg-nature-50 p-6 rounded-3xl border border-nature-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-nature-600 p-2 rounded-lg">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900">¿Usar tus puntos?</p>
                <p className="text-sm text-nature-700">Tenés 1500 puntos disponibles</p>
              </div>
            </div>
            <button 
              onClick={() => setUsePoints(!usePoints)}
              className={`w-12 h-6 rounded-full transition-all relative ${usePoints ? 'bg-nature-600' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${usePoints ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </section>
      </div>

      {/* Resumen */}
      <div className="lg:sticky lg:top-32 h-fit">
        <div className="bg-kraft-900 text-white p-8 rounded-[2.5rem] shadow-2xl">
          <h3 className="text-2xl font-bold mb-8">Resumen del Pedido</h3>
          <div className="space-y-4 mb-8">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-center text-gray-300">
                <span>{item.name} x {item.quantity}</span>
                <span className="font-bold text-white">${item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          
          <div className="border-t border-white/10 pt-6 space-y-3">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Envío</span>
              <span>${shippingCost}</span>
            </div>
            {usePoints && (
              <div className="flex justify-between text-nature-400">
                <span>Descuento Puntos</span>
                <span>-${pointsDiscount}</span>
              </div>
            )}
            <div className="flex justify-between text-2xl font-black pt-4 text-white">
              <span>TOTAL</span>
              <span>${total}</span>
            </div>
          </div>

          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-10 bg-nature-600 hover:bg-nature-500 text-white py-5 rounded-2xl font-black text-xl transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <>
                <CreditCard className="w-6 h-6" />
                PAGAR CON MERCADO PAGO
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
