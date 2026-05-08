import { prisma } from "@/lib/prisma";
import OrderList from "./OrderList";

export const dynamic = 'force-dynamic';

export default async function AdminPedidosPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-3xl font-bold text-kraft-900">Gestión de Pedidos</h1>
          <p className="text-kraft-600">Controla tus ventas y coordina las entregas.</p>
        </div>
      </div>

      <OrderList initialOrders={orders} />
    </div>
  );
}
