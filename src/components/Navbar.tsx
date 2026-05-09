"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ShoppingCart, User, Egg } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const getTotalItems = useCartStore((state) => state.getTotalItems);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // No mostrar la Navbar en el panel de administración
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const cartItemsCount = mounted ? getTotalItems() : 0;

  return (
    <header 
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        isScrolled || pathname !== '/' ? "bg-kraft-900 shadow-2xl py-2" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-white/10 p-2.5 rounded-full backdrop-blur-md group-hover:bg-nature-600 transition-all duration-500 shadow-inner">
            <Egg className="w-6 h-6 text-kraft-200" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl md:text-2xl font-black tracking-widest text-white drop-shadow-md">
              DON LUCAS
            </span>
            <span className="text-[9px] uppercase tracking-[0.4em] text-nature-400 font-bold -mt-1 drop-shadow-sm">
              Huevos de Campo
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-10 font-sans text-[11px] font-black uppercase tracking-[0.2em] text-white/90">
          <Link href="/productos" className="hover:text-nature-400 transition-colors duration-300">Productos</Link>
          <Link href="/#beneficios" className="hover:text-nature-400 transition-colors duration-300">Beneficios</Link>
          <Link href="/#zonas" className="hover:text-nature-400 transition-colors duration-300">Zonas de Envío</Link>
          <Link href="/#nosotros" className="hover:text-nature-400 transition-colors duration-300">Sobre Nosotros</Link>
          <Link href="/#contacto" className="hover:text-nature-400 transition-colors duration-300">Contacto</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-6 text-white">
          <Link href="/cuenta" className="hidden md:block hover:text-nature-400 transition-all transform hover:scale-110">
            <User className="w-6 h-6" />
          </Link>
          
          <button 
            onClick={() => useCartStore.getState().openCart()}
            className="relative group p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300"
          >
            <ShoppingCart className="w-6 h-6 group-hover:text-nature-400 transition-colors" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-nature-600 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-lg border-2 border-kraft-900 animate-in zoom-in duration-300">
                {cartItemsCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden bg-white/10 p-2.5 rounded-xl backdrop-blur-md hover:bg-white/20 transition-all"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-kraft-900/98 backdrop-blur-2xl border-t border-kraft-800 shadow-2xl lg:hidden flex flex-col font-sans overflow-hidden"
          >
            <div className="p-8 space-y-6">
              {[
                { label: "Productos", href: "/productos" },
                { label: "Beneficios", href: "/#beneficios" },
                { label: "Zonas de Envío", href: "/#zonas" },
                { label: "Sobre Nosotros", href: "/#nosotros" },
                { label: "Contacto", href: "/#contacto" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-xl font-black text-kraft-100 hover:text-nature-400 transition-all px-4"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-6 border-t border-kraft-800">
                <Link
                  href="/cuenta"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-3 text-lg font-black text-white px-4 py-5 bg-nature-600 rounded-2xl shadow-xl active:scale-95 transition-all"
                >
                  <User className="w-5 h-5" />
                  Mi Cuenta Don Lucas
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
