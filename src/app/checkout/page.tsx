import { prisma } from "@/lib/prisma";
import CheckoutForm from "@/components/CheckoutForm";
import { Egg } from "lucide-react";

export const dynamic = 'force-dynamic';

const MOCK_ZONES = [
  { id: "1", name: "San Rafael Centro", price: 0 },
  { id: "2", name: "Cuadro Nacional", price: 500 },
  { id: "3", name: "Rama Caída", price: 800 },
  { id: "4", name: "Las Paredes", price: 600 }
];

export default async function CheckoutPage() {
  let shippingZones = [];
  let userPoints = 0;
  let pointValueInPeso = 1.0;

  try {
    const { getServerSession } = await import("next-auth/next");
    const { authOptions } = await import("@/lib/auth");
    
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({ where: { email: session.user.email } });
      if (user) userPoints = user.points;
    }

    const settings = await prisma.settings.findUnique({ where: { id: "global" } });
    if (settings) pointValueInPeso = settings.pointValueInPeso;

    shippingZones = await prisma.shippingZone.findMany({
      orderBy: { name: 'asc' }
    });
    // Si la DB está vacía, usamos mocks
    if (shippingZones.length === 0) shippingZones = MOCK_ZONES;
  } catch (e) {
    console.log("Error cargando checkout data", e);
    shippingZones = MOCK_ZONES;
  }

  return (
    <div className="min-h-screen bg-[#fdfbf7] pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="bg-nature-600 p-3 rounded-2xl shadow-lg rotate-3">
              <Egg className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-black text-gray-900 leading-tight">Finalizar Compra</h1>
              <p className="text-lg text-gray-500 font-medium">Completá tus datos para recibir los mejores huevos de campo.</p>
            </div>
          </div>
          
          <CheckoutForm 
            shippingZones={shippingZones} 
            userPoints={userPoints} 
            pointValueInPeso={pointValueInPeso} 
          />
        </div>
      </div>
    </div>
  );
}
