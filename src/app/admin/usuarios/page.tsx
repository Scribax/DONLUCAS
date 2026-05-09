import { prisma } from "@/lib/prisma";
import { Users, Mail, Award } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { orders: true }
      }
    }
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-kraft-100">
        <div>
          <h1 className="font-serif text-3xl font-bold text-kraft-900">Gestión de Usuarios</h1>
          <p className="text-kraft-600">Visualiza los clientes registrados y sus estadísticas.</p>
        </div>
        <div className="bg-nature-50 text-nature-700 px-4 py-2 rounded-xl font-bold text-sm">
          {users.length} Usuarios Totales
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-kraft-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-kraft-50 border-b border-kraft-100 text-kraft-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-bold">Usuario</th>
                <th className="p-4 font-bold">Email</th>
                <th className="p-4 font-bold text-center">Rol</th>
                <th className="p-4 font-bold text-center">Puntos</th>
                <th className="p-4 font-bold text-center">Pedidos</th>
                <th className="p-4 font-bold text-right">Registro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-kraft-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-kraft-50/50 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-kraft-100 p-2 rounded-full">
                        <Users className="w-4 h-4 text-kraft-600" />
                      </div>
                      <span className="font-bold text-kraft-900">{user.name || 'Sin nombre'}</span>
                    </div>
                  </td>
                  <td className="p-4 text-kraft-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-kraft-400" />
                      {user.email}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`text-[10px] uppercase font-black px-2 py-1 rounded-full ${
                      user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="inline-flex items-center gap-1 bg-nature-50 text-nature-700 px-2 py-1 rounded-lg font-bold text-sm">
                      <Award className="w-4 h-4" />
                      {user.points}
                    </div>
                  </td>
                  <td className="p-4 text-center font-bold text-kraft-700">
                    {user._count.orders}
                  </td>
                  <td className="p-4 text-right text-kraft-500 text-sm" suppressHydrationWarning>
                    {new Date(user.createdAt).toLocaleDateString('es-AR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {users.length === 0 && (
            <div className="p-10 text-center text-kraft-400 italic">
              No hay usuarios registrados aún.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
