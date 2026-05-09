"use client";

import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartDrawer() {
  const { isOpen, closeCart, items, updateQuantity, removeItem, getTotalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Evitar scroll en el fondo cuando el carrito está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted) return null;

  const subtotal = getTotalPrice();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Fondo difuminado (Backdrop) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Panel Lateral */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-[100dvh] w-full max-w-md bg-[#fdfbf7] shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-kraft-200 bg-white shadow-sm z-10">
              <div className="flex items-center gap-3">
                <div className="bg-nature-100 p-2.5 rounded-xl text-nature-600">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h2 className="font-serif text-2xl font-black text-kraft-900 tracking-tight">Tu Canasta</h2>
              </div>
              <button 
                onClick={closeCart}
                className="p-2 hover:bg-kraft-100 rounded-full transition-colors text-kraft-500 hover:text-kraft-900"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Productos */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-kraft-400">
                  <div className="bg-kraft-100 p-6 rounded-full mb-4">
                    <ShoppingBag className="w-16 h-16 text-kraft-300" />
                  </div>
                  <p className="text-xl font-bold text-kraft-900 font-serif">Tu canasta está vacía</p>
                  <p className="text-sm">¡Agrega algunos huevos frescos de campo para continuar!</p>
                  <button 
                    onClick={closeCart}
                    className="mt-8 bg-white border border-kraft-200 text-kraft-900 font-bold px-6 py-3 rounded-xl hover:bg-kraft-50 transition shadow-sm"
                  >
                    Seguir comprando
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-white border border-kraft-200 rounded-2xl shadow-sm relative group hover:border-nature-300 transition-colors">
                    <div className="relative w-20 h-20 bg-kraft-50 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center border border-kraft-100">
                      {item.imageUrl ? (
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                      ) : (
                        <span className="text-[10px] text-kraft-400 font-bold uppercase tracking-wider text-center px-2">Sin imagen</span>
                      )}
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div className="pr-6">
                        <h3 className="font-bold text-kraft-900 leading-tight text-sm md:text-base">{item.name}</h3>
                        <p className="text-nature-600 font-black mt-1">${item.price}</p>
                      </div>
                      
                      <div className="flex items-center mt-3">
                        <div className="flex items-center bg-kraft-50 rounded-lg border border-kraft-200 overflow-hidden">
                          <button 
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-1.5 px-3 text-kraft-500 hover:text-kraft-900 hover:bg-kraft-100 transition-colors"
                          >
                            <Minus className="w-3 h-3 md:w-4 md:h-4" />
                          </button>
                          <span className="w-8 text-center font-bold text-xs md:text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 px-3 text-kraft-500 hover:text-kraft-900 hover:bg-kraft-100 transition-colors"
                          >
                            <Plus className="w-3 h-3 md:w-4 md:h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => removeItem(item.id)}
                      className="absolute top-3 right-3 p-2 text-kraft-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-100 md:opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 bg-white border-t border-kraft-200 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] z-10">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-kraft-500 font-bold uppercase tracking-wider text-sm">Subtotal</span>
                  <span className="text-4xl font-black text-nature-600 tracking-tight">${subtotal}</span>
                </div>
                <Link 
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full bg-nature-600 hover:bg-nature-700 text-white font-black text-lg py-5 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] shadow-[0_10px_30px_rgba(45,90,39,0.2)]"
                >
                  <ShoppingBag className="w-6 h-6" />
                  Finalizar Compra
                </Link>
                <p className="text-center text-xs text-kraft-400 mt-4 font-medium">
                  El costo de envío y los puntos de fidelidad se calculan en el siguiente paso.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
