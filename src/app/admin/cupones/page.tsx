"use client";

import { useState, useEffect } from "react";
import { Trash2, Ticket, Plus, X, Calendar, Tag } from "lucide-react";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount: "",
    type: "FIXED",
    expiresAt: "",
    usageLimit: ""
  });

  useEffect(() => {
    fetch("/api/admin/coupons")
      .then(res => res.json())
      .then(data => Array.isArray(data) ? setCoupons(data) : setCoupons([]));
  }, []);

  const saveCoupon = async () => {
    if (!newCoupon.code || !newCoupon.discount) {
      alert("Código y descuento son obligatorios");
      return;
    }

    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCoupon)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar");
      
      setCoupons([data, ...coupons]);
      setIsAdding(false);
      setNewCoupon({ code: "", discount: "", type: "FIXED", expiresAt: "", usageLimit: "" });
    } catch (err: any) {
      alert(err.message || "Error al guardar cupón");
    }
  };

  const deleteCoupon = async (id: string) => {
    if (!confirm("¿Eliminar este cupón?")) return;
    try {
      const res = await fetch(`/api/admin/coupons?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Error al eliminar");
      
      setCoupons(coupons.filter(c => c.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-kraft-100 flex justify-between items-center">
        <div>
          <h1 className="font-serif text-3xl font-bold text-kraft-900">Cupones de Descuento</h1>
          <p className="text-kraft-600">Crea códigos promocionales para fidelizar a tus clientes.</p>
        </div>
        <div className="bg-nature-50 p-4 rounded-2xl">
          <Ticket className="w-10 h-10 text-nature-600" />
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-nature-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-nature-700 transition shadow-lg"
        >
          <Plus className="w-5 h-5" /> Nuevo Cupón
        </button>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-kraft-900 p-6 text-white flex justify-between items-center">
              <h2 className="font-bold text-xl">Crear Nuevo Cupón</h2>
              <button onClick={() => setIsAdding(false)} className="hover:rotate-90 transition-transform">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8 space-y-5">
              <div>
                <label className="block text-xs font-bold text-kraft-500 mb-2 uppercase tracking-widest">Código del Cupón</label>
                <input 
                  type="text" 
                  placeholder="Ej: DONLUCAS20"
                  value={newCoupon.code}
                  onChange={e => setNewCoupon({...newCoupon, code: e.target.value})}
                  className="w-full p-4 bg-kraft-50 border border-kraft-100 rounded-2xl outline-none focus:ring-2 focus:ring-nature-600 font-bold"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-kraft-500 mb-2 uppercase tracking-widest">Descuento</label>
                  <input 
                    type="number" 
                    placeholder="0"
                    value={newCoupon.discount}
                    onChange={e => setNewCoupon({...newCoupon, discount: e.target.value})}
                    className="w-full p-4 bg-kraft-50 border border-kraft-100 rounded-2xl outline-none focus:ring-2 focus:ring-nature-600 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-kraft-500 mb-2 uppercase tracking-widest">Tipo</label>
                  <select 
                    value={newCoupon.type}
                    onChange={e => setNewCoupon({...newCoupon, type: e.target.value})}
                    className="w-full p-4 bg-kraft-50 border border-kraft-100 rounded-2xl outline-none focus:ring-2 focus:ring-nature-600 font-bold"
                  >
                    <option value="FIXED">Pesos ($)</option>
                    <option value="PERCENT">Porcentaje (%)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-kraft-500 mb-2 uppercase tracking-widest">Límite de Usos (opcional)</label>
                <input 
                  type="number" 
                  placeholder="Sin límite"
                  value={newCoupon.usageLimit}
                  onChange={e => setNewCoupon({...newCoupon, usageLimit: e.target.value})}
                  className="w-full p-4 bg-kraft-50 border border-kraft-100 rounded-2xl outline-none focus:ring-2 focus:ring-nature-600 font-bold"
                />
              </div>

              <button 
                onClick={saveCoupon}
                className="w-full bg-nature-600 text-white font-black py-4 rounded-2xl hover:bg-nature-700 transition shadow-xl"
              >
                Crear Cupón Ahora
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map(coupon => (
          <div key={coupon.id} className="bg-white p-6 rounded-3xl shadow-sm border border-kraft-100 relative group overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 ${coupon.type === 'PERCENT' ? 'bg-blue-600' : 'bg-nature-600'}`}></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className="bg-kraft-900 text-white px-3 py-1 rounded-lg font-mono font-bold tracking-wider">
                {coupon.code}
              </div>
              <button 
                onClick={() => deleteCoupon(coupon.id)}
                className="text-red-400 hover:text-red-600 transition p-2 hover:bg-red-50 rounded-lg relative z-10"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-3xl font-black text-kraft-900">
                {coupon.type === 'PERCENT' ? `${coupon.discount}%` : `$${coupon.discount}`}
                <span className="text-sm font-normal text-kraft-400 ml-2">de descuento</span>
              </p>
              <div className="flex items-center gap-4 text-xs font-bold text-kraft-500">
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3" /> {coupon.usedCount} usados
                </span>
                {coupon.usageLimit && (
                  <span className="flex items-center gap-1">
                    / {coupon.usageLimit} total
                  </span>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-dotted border-kraft-100 flex justify-between items-center">
              <span className={`text-[10px] uppercase font-black px-2 py-1 rounded-full ${coupon.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {coupon.active ? 'Activo' : 'Inactivo'}
              </span>
              <span className="text-[10px] text-kraft-300">ID: {coupon.id.slice(-6)}</span>
            </div>
          </div>
        ))}

        {coupons.length === 0 && (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="bg-kraft-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
              <Ticket className="w-10 h-10 text-kraft-200" />
            </div>
            <div>
              <p className="text-kraft-900 font-bold text-xl">No hay cupones activos</p>
              <p className="text-kraft-500 text-sm">Empieza creando uno para incentivar las ventas.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
