"use client";

import { useState } from "react";
import { 
  MapPin, 
  Phone, 
  ChevronRight, 
  CheckCircle, 
  Truck, 
  XCircle,
  ExternalLink
} from "lucide-react";

const STATUS_STYLES: Record<string, { label: string, color: string, icon: any }> = {
  PENDING: { label: "Pendiente", color: "bg-yellow-100 text-yellow-700", icon: ChevronRight },
  PAID: { label: "Pagado", color: "bg-blue-100 text-blue-700", icon: CheckCircle },
  CONFIRMED: { label: "Confirmado", color: "bg-orange-100 text-orange-700", icon: CheckCircle },
  SHIPPED: { label: "En Camino", color: "bg-indigo-100 text-indigo-700", icon: Truck },
  DELIVERED: { label: "Entregado", color: "bg-green-100 text-green-700", icon: CheckCircle },
  CANCELLED: { label: "Cancelado", color: "bg-red-100 text-red-700", icon: XCircle },
};

export default function OrderList({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const updateStatus = async (orderId: string, newStatus: string) => {
    setLoadingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error("Error al actualizar");
      
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert("Error actualizando el pedido");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row justify-between gap-6">
              {/* Info Cliente */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400">#{order.id.slice(-6).toUpperCase()}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${STATUS_STYLES[order.status]?.color}`}>
                    {STATUS_STYLES[order.status]?.label}
                  </span>
                  <span className="text-xs text-gray-500" suppressHydrationWarning>
                    {new Date(order.createdAt).toLocaleString('es-AR')}
                  </span>
                </div>
                
                <h3 className="font-bold text-xl text-kraft-900">{order.customerName}</h3>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-kraft-700">
                    <MapPin className="w-4 h-4 text-nature-600" />
                    <span>{order.address}</span>
                    {order.latitude && (
                      <a 
                        href={`https://www.google.com/maps?q=${order.latitude},${order.longitude}`}
                        target="_blank"
                        className="text-nature-600 hover:underline flex items-center gap-1 font-bold ml-2"
                      >
                        Ver Mapa <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-kraft-700">
                    <Phone className="w-4 h-4 text-nature-600" />
                    <span>{order.customerPhone}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-50">
                  <p className="text-sm font-medium text-gray-500 mb-2">Detalle:</p>
                  <div className="flex flex-wrap gap-2">
                    {order.items.length > 0 ? (
                      order.items.map((item: any, idx: number) => (
                        <span key={idx} className="bg-kraft-50 text-kraft-800 text-xs px-3 py-1 rounded-lg border border-kraft-100">
                          {item.quantity}x {item.product?.name || "Producto de prueba"}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs italic text-gray-400">Pedido del catálogo de prueba</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Acciones y Total */}
              <div className="lg:w-64 flex flex-col justify-between border-l border-gray-50 pl-0 lg:pl-6">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total a cobrar</p>
                  <p className="text-3xl font-bold text-nature-600">${order.totalAmount.toLocaleString('es-AR')}</p>
                  <p className="text-xs text-gray-400">Envío: ${order.shippingCost}</p>
                </div>

                <div className="mt-6 space-y-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 text-right">Cambiar Estado</p>
                  <div className="grid grid-cols-2 gap-2">
                    {order.status === 'PENDING' && (
                      <button 
                        onClick={() => updateStatus(order.id, 'CONFIRMED')}
                        disabled={loadingId === order.id}
                        className="col-span-2 bg-orange-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-orange-700 transition disabled:opacity-50"
                      >
                        Confirmar Pedido
                      </button>
                    )}
                    {(order.status === 'CONFIRMED' || order.status === 'PAID') && (
                      <button 
                        onClick={() => updateStatus(order.id, 'SHIPPED')}
                        disabled={loadingId === order.id}
                        className="col-span-2 bg-indigo-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                      >
                        Enviar a Reparto
                      </button>
                    )}
                    {order.status === 'SHIPPED' && (
                      <button 
                        onClick={() => updateStatus(order.id, 'DELIVERED')}
                        disabled={loadingId === order.id}
                        className="col-span-2 bg-green-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                      >
                        Marcar Entregado
                      </button>
                    )}
                    {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                      <button 
                        onClick={() => updateStatus(order.id, 'CANCELLED')}
                        disabled={loadingId === order.id}
                        className="col-span-2 text-red-500 text-xs font-bold py-2 rounded-lg hover:bg-red-50 transition border border-red-100 disabled:opacity-50"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {orders.length === 0 && (
        <div className="bg-white p-20 rounded-3xl border border-dashed border-gray-200 text-center">
          <p className="text-gray-400">No hay pedidos registrados todavía.</p>
        </div>
      )}
    </div>
  );
}
