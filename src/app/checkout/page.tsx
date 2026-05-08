import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function CheckoutPage() {
  let shippingZones = [];
  try {
    shippingZones = await prisma.shippingZone.findMany({
      orderBy: { price: 'asc' }
    });
  } catch (e) {
    shippingZones = [];
  }

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4 text-[#2d5a27]">Finalizar Compra</h1>
      <p className="text-gray-600 mb-8">El formulario de pago se está cargando...</p>
      <div className="bg-gray-100 p-8 rounded-xl max-w-md mx-auto">
        <p className="text-sm text-gray-500">
          Zonas de envío detectadas: {shippingZones.length}
        </p>
      </div>
    </div>
  );
}
