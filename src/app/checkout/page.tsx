"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import MapSelector from "@/components/MapSelector";
import { ArrowRight, MessageCircle, CreditCard, AlertCircle, Search, MapPin, Award, Gift, Tag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// Coordenadas de la granja (Centro de San Rafael aprox)
const FARM_LOCATION = { lat: -34.6177, lng: -68.3301 };

// Fórmula de Haversine para calcular distancia en km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Función para detectar si un punto (cliente) está dentro de un polígono (zona)
function isPointInPolygon(point: {lat: number, lng: number}, polygon: any[]) {
  const x = point.lat, y = point.lng;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lat, yi = polygon[i].lng;
    const xj = polygon[j].lat, yj = polygon[j].lng;
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [pointsToUse, setPointsToUse] = useState(0);
  const [usePoints, setUsePoints] = useState(false);

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [shippingZones, setShippingZones] = useState<any[]>([]);
  const [currentZoneName, setCurrentZoneName] = useState<string>("");
  
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/shipping-zones")
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.zones)) {
          setShippingZones(data.zones);
        }
      });
  }, []);

  // Calcular envío cuando cambia la ubicación
  useEffect(() => {
    if (location) {
      // 1. Calculamos distancia (para el mensaje informativo)
      const dist = calculateDistance(FARM_LOCATION.lat, FARM_LOCATION.lng, location.lat, location.lng);
      setDistance(dist);
      
      // 2. Buscamos si cae en alguna zona poligonal
      let foundZone = null;
      for (const zone of shippingZones) {
        if (isPointInPolygon(location, zone.coordinates)) {
          foundZone = zone;
          break;
        }
      }

      if (foundZone) {
        setShippingCost(foundZone.price);
        setCurrentZoneName(foundZone.name);
      } else {
        // Fallback: Si no está en ninguna zona dibujada, costo estándar por distancia
        setShippingCost(dist > 5 ? 3000 : 1500);
        setCurrentZoneName("Fuera de zona");
      }
    }
  }, [location, shippingZones]);

  if (!mounted) return null;

  const applyCoupon = async () => {
    if (!couponCode) return;
    setCouponError("");
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode })
      });
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error);
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon(data);
      }
    } catch (err) {
      setCouponError("Error al validar cupón");
    }
  };

  const getCouponDiscount = () => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === "FIXED") return appliedCoupon.discount;
    return (getTotalPrice() * appliedCoupon.discount) / 100;
  };

  const subtotal = getTotalPrice();
  const couponDiscount = getCouponDiscount();
  const pointDiscount = usePoints ? pointsToUse * 10 : 0;
  const finalTotal = Math.max(0, subtotal + shippingCost - pointDiscount - couponDiscount);

  const handleAddressSearch = async () => {
    if (!formData.address) return;
    setIsSearching(true);
    setSearchResults([]);
    try {
      // Usamos Nominatim de OpenStreetMap (Gratis, sin API key)
      // Agregamos "San Rafael, Mendoza, Argentina" para acotar la búsqueda
      const query = encodeURIComponent(`${formData.address}, San Rafael, Mendoza, Argentina`);
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=3`);
      const data = await res.json();
      
      if (data && data.length > 0) {
        setSearchResults(data);
      } else {
        alert("No encontramos esa calle exacta. Intenta buscar solo el nombre de la calle (sin el número) y luego arrastra el pin manualmente.");
      }
    } catch (err) {
      console.error(err);
      alert("Error al buscar la dirección.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    setLocation({ lat, lng });
    setFormData({ ...formData, address: result.name || result.display_name.split(",")[0] });
    setSearchResults([]);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold mb-4 text-kraft-900">No hay productos para pagar</h2>
        <Link href="/productos" className="text-nature-600 font-bold hover:underline">Volver a la tienda</Link>
      </div>
    );
  }

  const handleWhatsAppCheckout = async () => {
    if (!formData.name || !formData.phone || !formData.address || !location) {
      alert("Por favor completa todos los datos y marca tu ubicación en el mapa.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Guardar la orden en la BD
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customer: formData,
          location,
          shippingCost,
          distance,
          totalAmount: finalTotal,
          pointsUsed: usePoints ? pointsToUse : 0,
          couponId: appliedCoupon?.id || null,
          paymentMethod: "WHATSAPP",
        }),
      });

      if (!res.ok) throw new Error("Error guardando el pedido");
      const { orderId } = await res.json();
      const shortOrderId = orderId.slice(-6).toUpperCase();

      // 2. Generar mensaje para WhatsApp
      let orderText = `*¡Hola Don Lucas!* Quisiera confirmar mi pedido:%0A%0A`;
      orderText += `*Orden N°:* ORD-${shortOrderId}%0A%0A`;
      items.forEach(item => {
        orderText += `- ${item.quantity}x ${item.name} ($${item.price * item.quantity})%0A`;
      });
      orderText += `%0A*Subtotal:* $${subtotal}`;
      orderText += `%0A*Envío:* $${shippingCost} (${currentZoneName})`;
      if (couponDiscount > 0) orderText += `%0A*Cupón (${appliedCoupon.code}):* -$${couponDiscount}`;
      if (pointDiscount > 0) orderText += `%0A*Descuento Puntos:* -$${pointDiscount}`;
      orderText += `%0A*Total a Pagar:* $${finalTotal}%0A%0A`;
      orderText += `*Mis datos:*%0ANombre: ${formData.name}%0ATel: ${formData.phone}%0ADirección: ${formData.address}`;
      orderText += `%0AUbicación: https://maps.google.com/?q=${location.lat},${location.lng}`;

      // 3. Abrir WhatsApp, limpiar carrito y redirigir
      window.open(`https://wa.me/5492604123456?text=${orderText}`, '_blank');
      clearCart();
      router.push('/checkout/exito');
    } catch (error) {
      console.error(error);
      alert("Hubo un error al procesar tu pedido. Por favor intenta de nuevo.");
      setIsSubmitting(false);
    }
  };

  const handleMercadoPagoCheckout = async () => {
    if (!formData.name || !formData.phone || !formData.address || !location) {
      alert("Por favor completa todos los datos y marca tu ubicación en el mapa.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/payments/create-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })),
          customer: formData,
          location,
          shippingCost,
          distance,
          totalAmount: finalTotal,
          pointsUsed: pointDiscount / 10,
          couponId: appliedCoupon?.id || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al generar pago");

      // Redirigir a MercadoPago
      window.location.href = data.init_point;
    } catch (error: any) {
      alert(error.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 flex-1">
      <h1 className="font-serif text-3xl font-bold mb-8 text-kraft-900 border-b border-kraft-200 pb-4">
        Finalizar Compra
      </h1>

      {!session && (
        <div className="bg-nature-600/10 border border-nature-600/20 p-4 rounded-2xl mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-nature-600" />
            <p className="text-sm text-nature-800">
              <span className="font-bold">¡Estás comprando como invitado!</span> Registrate ahora y suma <b>{Math.floor(finalTotal / 100)} puntos</b> con este pedido.
            </p>
          </div>
          <Link href="/registro?callbackUrl=/checkout" className="text-nature-600 font-bold text-sm hover:underline flex-shrink-0">
            Crear cuenta →
          </Link>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Formulario y Mapa */}
        <div className="flex-1 space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-kraft-200">
            <h2 className="font-serif text-xl font-bold mb-4 text-kraft-900">1. Tus Datos</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-kraft-700 mb-1">Nombre Completo</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 border border-kraft-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nature-600"
                  placeholder="Juan Pérez"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-kraft-700 mb-1">Teléfono</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full p-3 border border-kraft-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nature-600"
                  placeholder="260 4..."
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-bold text-kraft-700 mb-1">Dirección exacta</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddressSearch()}
                    className="w-full p-3 border border-kraft-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nature-600"
                    placeholder="Ej: Av. Mitre 1234"
                  />
                  <button 
                    onClick={handleAddressSearch}
                    disabled={isSearching || !formData.address}
                    className="bg-kraft-900 hover:bg-kraft-700 disabled:bg-kraft-500 text-white p-3 rounded-xl transition"
                    title="Buscar y ubicar en el mapa"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Resultados de búsqueda */}
                {searchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-kraft-200 rounded-xl shadow-lg overflow-hidden">
                    {searchResults.map((result, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectSearchResult(result)}
                        className="w-full text-left px-4 py-3 hover:bg-kraft-50 border-b border-kraft-100 last:border-0 flex items-start gap-3 transition"
                      >
                        <MapPin className="w-5 h-5 text-nature-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-kraft-900 leading-tight">
                          {result.display_name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                
                <p className="text-xs text-kraft-500 mt-2 font-medium">
                  💡 Tip: Si no encuentra tu dirección exacta, busca solo el nombre de tu calle, elige una opción y <b>arrastra el pin azul</b> con el dedo o ratón hasta tu casa.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-kraft-200">
            <h2 className="font-serif text-xl font-bold mb-4 text-kraft-900 flex justify-between items-center">
              2. Ubicación de Entrega
              {!location && <span className="text-sm font-sans text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4"/> Requerido</span>}
            </h2>
            <MapSelector onLocationSelect={(lat, lng) => setLocation({lat, lng})} externalLocation={location} />
          </div>
        </div>

        {/* Resumen y Pagos */}
        <div className="w-full lg:w-[400px]">
          <div className="bg-kraft-50 p-6 rounded-3xl shadow-sm border border-kraft-200 sticky top-24">
            <h2 className="font-serif text-xl font-bold mb-6 text-kraft-900">Resumen del Pedido</h2>
            
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.name}</span>
                  <span className="font-bold">${item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Cupón de Descuento */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-kraft-100 space-y-4 mb-6">
              <h2 className="font-serif text-md font-bold text-kraft-900 flex items-center gap-2">
                <Tag className="w-4 h-4 text-nature-600" /> ¿Tienes un cupón?
              </h2>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Código"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  className="flex-1 p-2 bg-kraft-50 border border-kraft-100 rounded-xl outline-none focus:ring-2 focus:ring-nature-600 text-sm font-bold uppercase"
                />
                <button 
                  onClick={applyCoupon}
                  className="bg-kraft-900 text-white px-4 rounded-xl font-bold text-sm hover:bg-kraft-800 transition"
                >
                  Aplicar
                </button>
              </div>
              {couponError && <p className="text-red-500 text-[10px] font-bold">{couponError}</p>}
              {appliedCoupon && <p className="text-nature-600 text-[10px] font-bold">¡Cupón {appliedCoupon.code} aplicado!</p>}
            </div>

            {/* Loyalty Points Panel */}
            {session?.user && (session.user as any).points > 0 && (
              <div className="bg-nature-600/5 border border-nature-600/20 p-4 rounded-2xl mb-6">
                <div className="flex items-center gap-2 mb-3 text-nature-800 font-bold text-sm">
                  <Gift className="w-4 h-4 text-nature-600" />
                  <span>Tus Puntos Don Lucas</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-kraft-700">Disponibles: <span className="font-bold text-kraft-900">{(session.user as any).points} pts</span></span>
                    <button 
                      type="button"
                      onClick={() => {
                        setUsePoints(!usePoints);
                        if (!usePoints) setPointsToUse((session.user as any).points);
                      }}
                      className={`text-[10px] uppercase tracking-wider font-black px-3 py-1 rounded-full transition ${usePoints ? 'bg-nature-600 text-white' : 'bg-kraft-200 text-kraft-700'}`}
                    >
                      {usePoints ? "Quitar" : "Usar"}
                    </button>
                  </div>
                  
                  {usePoints && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                      <input 
                        type="range" 
                        min="1" 
                        max={(session.user as any).points} 
                        value={pointsToUse}
                        onChange={(e) => setPointsToUse(parseInt(e.target.value))}
                        className="w-full accent-nature-600 h-1.5 bg-kraft-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-[10px] font-bold text-kraft-900">{pointsToUse} pts</span>
                        <span className="text-[10px] font-bold text-nature-600">-${pointsToUse * 10} ARS</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="border-t border-kraft-200 py-4 space-y-2">
              <div className="flex justify-between text-kraft-700">
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </div>
              <div className="flex justify-between text-kraft-700">
                <span>Envío {currentZoneName ? `(${currentZoneName})` : ''}</span>
                <span className="font-bold">
                  {!location ? 'Pendiente' : shippingCost === 0 ? '¡Gratis!' : `$${shippingCost}`}
                </span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-nature-600 font-bold bg-nature-50 p-2 rounded-lg border border-nature-100">
                  <span className="flex items-center gap-1 text-xs"><Tag className="w-3 h-3" /> Cupón: {appliedCoupon.code}</span>
                  <span className="text-sm">-${couponDiscount}</span>
                </div>
              )}
              {usePoints && (
                <div className="flex justify-between text-nature-600 font-bold animate-in zoom-in duration-300">
                  <span>Descuento Puntos ({pointsToUse} pts)</span>
                  <span>-${pointsToUse * 10}</span>
                </div>
              )}
            </div>

            <div className="border-t border-kraft-200 py-4 mb-6 flex justify-between items-center">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-3xl text-nature-600">
                ${finalTotal}
              </span>
            </div>

            <div className="space-y-3">
              <button 
                onClick={handleWhatsAppCheckout}
                disabled={!location || !formData.name || !formData.phone || !formData.address || isSubmitting}
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition"
              >
                <MessageCircle className="w-5 h-5" />
                {isSubmitting ? "Registrando..." : "Pedir por WhatsApp"}
              </button>
              
              <button 
                onClick={handleMercadoPagoCheckout}
                disabled={!location || !formData.name || !formData.phone || !formData.address || isSubmitting}
                className="w-full bg-[#009EE3] hover:bg-[#008ACA] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition"
              >
                <CreditCard className="w-5 h-5" />
                Pagar online (MercadoPago)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
