"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, PackageOpen, Users, Map, Tag, Menu, X, Egg } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MENU_ITEMS = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Pedidos", href: "/admin/pedidos", icon: ShoppingBag },
  { name: "Productos", href: "/admin/productos", icon: PackageOpen },
  { name: "Clientes", href: "/admin/clientes", icon: Users },
  { name: "Zonas de Envío", href: "/admin/zonas", icon: Map },
  { name: "Promociones", href: "/admin/promociones", icon: Tag },
];

export default function AdminSidebar({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-kraft-900 text-kraft-50 w-64 flex-shrink-0">
      <div className="p-6 flex items-center gap-3 border-b border-kraft-700">
        <Egg className="w-8 h-8 text-nature-600" />
        <span className="font-serif font-bold text-xl tracking-wider">DON LUCAS</span>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  isActive ? "bg-nature-600 text-white font-bold" : "hover:bg-kraft-700 text-kraft-200"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-kraft-700">
        <Link href="/" className="text-sm text-kraft-200 hover:text-white transition flex justify-center border border-kraft-700 rounded-lg py-2">
          Volver a la tienda
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-kraft-50 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween" }}
            className="fixed inset-y-0 left-0 z-50 md:hidden"
          >
            <SidebarContent />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full">
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-kraft-900 text-white h-16 flex items-center px-4 justify-between flex-shrink-0">
          <span className="font-serif font-bold text-xl">Admin</span>
          <button onClick={() => setIsOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
