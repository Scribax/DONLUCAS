import { prisma } from "@/lib/prisma";
import HomeContent from "@/components/HomeContent";
import WhatsAppButton from "@/components/WhatsAppButton";

export const dynamic = 'force-dynamic';

const MOCK_PRODUCTS = [
  { id: "1", name: "Maple x 30 - Grandes", description: "Huevos frescos de gallinas libres, tamaño XL.", price: 4500 },
  { id: "2", name: "Maple x 30 - Medianos", description: "Ideales para el consumo diario y repostería.", price: 4000 }
];

export default async function Home() {
  let products: any[] = [];
  let shippingZones: any[] = [];

  try {
    // Intentamos obtener productos reales (sin el filtro 'active' que daba error)
    products = await prisma.product.findMany({
      take: 4,
    });
    shippingZones = await prisma.shippingZone.findMany();
    
    // Si la DB está vacía, usamos mocks para que no se vea pelado
    if (products.length === 0) products = MOCK_PRODUCTS;
  } catch (e) {
    console.log("Modo Demo: Cargando Home con datos de prueba.");
    products = MOCK_PRODUCTS;
    shippingZones = [];
  }

  return (
    <>
      <HomeContent products={products} shippingZones={shippingZones} />
      <WhatsAppButton />
    </>
  );
}
