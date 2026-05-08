import { User as UserIcon, Package, Gift, Award, LogOut, LayoutDashboard } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata = {
  title: "Mi Cuenta | DON LUCAS",
};

const STATUS_STYLES: Record<string, { label: string, color: string }> = {
  PENDING: { label: "Pendiente", color: "bg-yellow-100 text-yellow-700" },
  PAID: { label: "Pagado", color: "bg-blue-100 text-blue-700" },
  CONFIRMED: { label: "Confirmado", color: "bg-orange-100 text-orange-700" },
  SHIPPED: { label: "En Camino", color: "bg-indigo-100 text-indigo-700" },
  DELIVERED: { label: "Entregado", color: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Cancelado", color: "bg-red-100 text-red-700" },
};

export default async function CuentaPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: { product: true }
          }
        }
      }
    }
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-12 flex-1">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Encabezado de la cuenta */}
        <div className="bg-white rounded-3xl shadow-sm border border-kraft-200 p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="bg-kraft-200 w-24 h-24 rounded-full flex items-center justify-center flex-shrink-0">
            <UserIcon className="w-12 h-12 text-kraft-900" />
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="font-serif text-3xl font-bold text-kraft-900">{user.name}</h1>
            <p className="text-kraft-700">{user.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3">
              <Link href="/api/auth/signout" className="inline-flex items-center gap-2 text-sm text-red-600 font-bold hover:underline">
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </Link>
              {user.role === 'ADMIN' && (
                <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-nature-600 font-bold hover:underline border-l border-kraft-200 pl-4">
                  <LayoutDashboard className="w-4 h-4" />
                  Panel Administrador
                </Link>
              )}
            </div>
          </div>
          
          <div className="bg-nature-600 text-white p-6 rounded-2xl text-center flex flex-col items-center min-w-[200px] shadow-md transform hover:scale-105 transition">
            <Award className="w-8 h-8 mb-2" />
            <span className="text-sm font-bold opacity-90">Tus Puntos</span>
            <span className="text-4xl font-black">{user.points}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Historial de Pedidos */}
          <div className="md:col-span-2 bg-white rounded-3xl shadow-sm border border-kraft-200 overflow-hidden">
            <div className="p-6 border-b border-kraft-200 flex items-center gap-3">
              <Package className="w-6 h-6 text-kraft-900" />
              <h2 className="font-serif font-bold text-2xl text-kraft-900">Mis Pedidos</h2>
            </div>
            
            <div className="p-6">
              {user.orders.length > 0 ? (
                <div className="space-y-4">
                  {user.orders.map((order) => (
                    <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-kraft-200 rounded-xl hover:bg-kraft-50 transition">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-bold text-kraft-900">#{order.id.slice(-6).toUpperCase()}</span>
                          <span className="text-sm text-kraft-500">
                            {new Date(order.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-kraft-700 text-sm">
                          {order.items.length > 0 
                            ? order.items.map(item => `${item.quantity}x ${item.product.name}`).join(", ")
                            : "Productos del catálogo de prueba"}
                        </p>
                      </div>
                      <div className="mt-4 sm:mt-0 text-left sm:text-right">
                        <div className="font-bold text-lg text-nature-600">${order.totalAmount.toLocaleString('es-AR')}</div>
                        <span className={`text-sm px-3 py-1 rounded-full font-bold ${STATUS_STYLES[order.status]?.color || "bg-gray-100 text-gray-700"}`}>
                          {STATUS_STYLES[order.status]?.label || order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-kraft-500 mb-4">Aún no has realizado pedidos.</p>
                  <Link href="/productos" className="bg-kraft-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-kraft-700 transition">
                    Hacer mi primer pedido
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sistema de Canje */}
          <div className="space-y-8">
            <div className="bg-kraft-50 rounded-3xl shadow-sm border border-kraft-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Gift className="w-6 h-6 text-nature-600" />
                <h2 className="font-serif font-bold text-xl text-kraft-900">Canjear Puntos</h2>
              </div>
              <p className="text-sm text-kraft-700 mb-6">Usa tus puntos acumulados para obtener productos gratis en tu próximo pedido.</p>
              
              <ul className="space-y-3">
                <li className={`flex justify-between items-center p-3 bg-white rounded-lg border border-kraft-200 ${user.points < 100 ? 'opacity-50 relative overflow-hidden group' : ''}`}>
                  <span className="font-bold text-sm">Media Docena</span>
                  <span className="text-nature-600 font-bold">100 pts</span>
                  {user.points < 100 && (
                    <div className="absolute inset-0 bg-kraft-900/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <span className="text-xs font-bold bg-white px-2 py-1 rounded">Te faltan {100 - user.points} pts</span>
                    </div>
                  )}
                </li>
                <li className={`flex justify-between items-center p-3 bg-white rounded-lg border border-kraft-200 ${user.points < 250 ? 'opacity-50 relative overflow-hidden group' : ''}`}>
                  <span className="font-bold text-sm">Docena de huevos</span>
                  <span className="text-nature-600 font-bold">250 pts</span>
                  {user.points < 250 && (
                    <div className="absolute inset-0 bg-kraft-900/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <span className="text-xs font-bold bg-white px-2 py-1 rounded">Te faltan {250 - user.points} pts</span>
                    </div>
                  )}
                </li>
                <li className={`flex justify-between items-center p-3 bg-white rounded-lg border border-kraft-200 ${user.points < 500 ? 'opacity-50 relative overflow-hidden group' : ''}`}>
                  <span className="font-bold text-sm">Maple de 30</span>
                  <span className="text-nature-600 font-bold">500 pts</span>
                  {user.points < 500 && (
                    <div className="absolute inset-0 bg-kraft-900/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <span className="text-xs font-bold bg-white px-2 py-1 rounded">Te faltan {500 - user.points} pts</span>
                    </div>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
