"use client";

import { useCartStore } from "@/store/useCartStore";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="p-8 text-center">Cargando carrito...</div>;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center flex-1 flex flex-col justify-center items-center">
        <h2 className="font-serif text-3xl font-bold mb-4 text-kraft-900">Tu carrito está vacío</h2>
        <p className="text-kraft-700 mb-8">¡Agrega algunos huevos de campo frescos para continuar!</p>
        <Link href="/#productos" className="bg-nature-600 hover:bg-nature-600/90 text-white font-bold py-3 px-8 rounded-xl transition">
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 flex-1">
      <h1 className="font-serif text-3xl md:text-4xl font-bold mb-8 text-kraft-900 border-b border-kraft-200 pb-4">
        Tu Carrito
      </h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Items List */}
        <div className="flex-1 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-kraft-200">
              <div className="relative w-24 h-24 bg-kraft-50 rounded-xl flex-shrink-0 flex items-center justify-center">
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover rounded-xl" />
                ) : (
                  <span className="text-xs text-kraft-500 italic">Sin imagen</span>
                )}
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-bold text-lg text-kraft-900">{item.name}</h3>
                <p className="text-nature-600 font-bold">${item.price}</p>
              </div>

              <div className="flex items-center gap-4 bg-kraft-50 rounded-full px-2 py-1 border border-kraft-200">
                <button 
                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  className="p-2 hover:bg-kraft-200 rounded-full transition text-kraft-700"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold w-6 text-center">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-2 hover:bg-kraft-200 rounded-full transition text-kraft-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="font-bold text-xl text-kraft-900 w-24 text-center">
                ${item.price * item.quantity}
              </div>

              <button 
                onClick={() => removeItem(item.id)}
                className="p-3 text-red-500 hover:bg-red-50 rounded-full transition"
                aria-label="Eliminar producto"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          
          <button 
            onClick={clearCart}
            className="text-kraft-700 hover:text-red-500 font-bold text-sm transition"
          >
            Vaciar Carrito
          </button>
        </div>

        {/* Resumen */}
        <div className="w-full lg:w-96 bg-kraft-50 p-8 rounded-3xl shadow-sm border border-kraft-200 h-fit sticky top-24">
          <h2 className="font-serif text-2xl font-bold mb-6 text-kraft-900">Resumen</h2>
          
          <div className="space-y-4 mb-6 text-kraft-900 border-b border-kraft-200 pb-6">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold">${getTotalPrice()}</span>
            </div>
            <div className="flex justify-between text-kraft-700 text-sm">
              <span>Envío</span>
              <span>Se calcula en el checkout</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-8">
            <span className="font-bold text-lg">Total</span>
            <span className="font-bold text-3xl text-nature-600">${getTotalPrice()}</span>
          </div>

          <Link 
            href={session ? "/checkout" : "/checkout/auth"}
            className="w-full bg-nature-600 hover:bg-nature-600/90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition shadow-md hover:shadow-lg"
          >
            Proceder al pago
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
