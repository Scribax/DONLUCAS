import Link from "next/link";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut, 
  Egg,
  Package,
  Map as MapIcon,
  Ticket
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-kraft-900 text-white flex flex-col sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3 border-b border-kraft-800">
          <Egg className="w-8 h-8 text-kraft-200" />
          <span className="font-serif text-xl font-bold tracking-tight">ADMIN</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link 
            href="/admin" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-kraft-800 transition text-kraft-100"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link 
            href="/admin/pedidos" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-kraft-800 transition text-kraft-100"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Pedidos</span>
          </Link>
          <Link 
            href="/admin/zonas" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-kraft-800 transition text-kraft-100"
          >
            <MapIcon className="w-5 h-5" />
            <span>Zonas de Envío</span>
          </Link>
          <Link 
            href="/admin/cupones" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-kraft-800 transition text-kraft-100"
          >
            <Ticket className="w-5 h-5" />
            <span>Cupones</span>
          </Link>
          <Link 
            href="/admin/productos" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-kraft-800 transition text-kraft-100"
          >
            <Package className="w-5 h-5" />
            <span>Productos</span>
          </Link>
          <Link 
            href="/admin/usuarios" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-kraft-800 transition text-kraft-100"
          >
            <Users className="w-5 h-5" />
            <span>Usuarios</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-kraft-800">
          <Link 
            href="/" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-900/30 text-red-300 transition"
          >
            <LogOut className="w-5 h-5" />
            <span>Salir del Admin</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
