import { prisma } from "@/lib/prisma";
import { 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Clock,
  ArrowRight,
  Package,
  Calendar
} from "lucide-react";
import AdminCharts from "@/components/AdminCharts";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [totalOrders, totalUsers, pendingOrders, totalRevenue, recentOrders] = await Promise.all([
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.aggregate({ _sum: { totalAmount: true } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: true }
    })
  ]);

  // Obtener ventas de los últimos 7 días
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const sales = await prisma.order.findMany({
    where: {
      createdAt: { gte: sevenDaysAgo },
      status: { not: 'CANCELLED' }
    },
    select: {
      createdAt: true,
      totalAmount: true
    }
  });

  // Agrupar por día para los gráficos
  const dailyStats = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toLocaleDateString('es-AR', { weekday: 'short' });
    
    const daySales = sales.filter(s => 
      new Date(s.createdAt).toDateString() === d.toDateString()
    );

    return {
      date: dateStr,
      total: daySales.reduce((acc, s) => acc + s.totalAmount, 0),
      count: daySales.length
    };
  });

  const stats = [
    { 
      label: "Pedidos Totales", 
      value: totalOrders, 
      icon: ShoppingBag, 
      color: "text-nature-700", 
      bg: "bg-nature-50" 
    },
    { 
      label: "Usuarios", 
      value: totalUsers, 
      icon: Users, 
      color: "text-blue-600", 
      bg: "bg-blue-50" 
    },
    { 
      label: "Pendientes", 
      value: pendingOrders, 
      icon: Clock, 
      color: "text-orange-600", 
      bg: "bg-orange-50" 
    },
    { 
      label: "Recaudación Total", 
      value: `$${(totalRevenue._sum.totalAmount || 0).toLocaleString('es-AR')}`, 
      icon: TrendingUp, 
      color: "text-kraft-900", 
      bg: "bg-kraft-50" 
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-serif text-4xl font-bold text-kraft-900">Panel de Control</h1>
          <p className="text-kraft-600 mt-2">Bienvenido de nuevo, Franco. Esto es lo que está pasando hoy.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl border border-kraft-100 flex items-center gap-2 text-kraft-500 text-sm font-medium shadow-sm">
          <Calendar className="w-4 h-4" />
          {new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl shadow-sm border border-kraft-50 flex items-center gap-4 hover:shadow-md transition duration-300">
            <div className={`${stat.bg} p-4 rounded-2xl`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs text-kraft-400 font-bold uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-black text-kraft-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <AdminCharts salesData={dailyStats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pedidos Recientes */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-kraft-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-2xl font-bold text-kraft-900">Pedidos Recientes</h2>
            <Link href="/admin/pedidos" className="text-nature-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl border border-kraft-50 hover:bg-kraft-50/50 transition">
                <div className="flex items-center gap-4">
                  <div className="bg-kraft-100 p-3 rounded-xl">
                    <Package className="w-5 h-5 text-kraft-700" />
                  </div>
                  <div>
                    <p className="font-bold text-kraft-900">{order.user?.name || 'Invitado'}</p>
                    <p className="text-xs text-kraft-500">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-kraft-900">${order.totalAmount}</p>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                    order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 
                    order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {order.status === 'PENDING' ? 'Pendiente' : 'Completado'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="bg-kraft-900 p-8 rounded-3xl shadow-xl text-white">
          <h2 className="font-serif text-2xl font-bold mb-6">Gestión Rápida</h2>
          <div className="space-y-4">
            <Link href="/admin/productos" className="block w-full p-4 bg-kraft-800 hover:bg-kraft-700 border border-kraft-700 rounded-2xl transition text-center font-bold">
              + Nuevo Producto
            </Link>
            <Link href="/admin/zonas" className="block w-full p-4 bg-kraft-800 hover:bg-kraft-700 border border-kraft-700 rounded-2xl transition text-center font-bold">
              Editar Zonas de Envío
            </Link>
            <div className="pt-6 mt-6 border-t border-kraft-800">
              <p className="text-kraft-400 text-xs font-bold uppercase mb-4">Recordatorio</p>
              <div className="bg-nature-600/20 p-4 rounded-2xl border border-nature-600/30">
                <p className="text-sm italic text-nature-200">"El éxito está en la calidad de cada maple entregado."</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
