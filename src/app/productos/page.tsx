import ProductCard from "@/components/ProductCard";
import { Egg } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

const MOCK_PRODUCTS = [
  { id: "1", name: "Maple x 30 - Grandes", description: "Huevos frescos de gallinas libres, tamaño XL.", price: 4500, active: true },
  { id: "2", name: "Maple x 30 - Medianos", description: "Ideales para el consumo diario y repostería.", price: 4000, active: true },
  { id: "3", name: "Docena de Huevos", description: "La medida justa para tu semana.", price: 1800, active: true },
  { id: "4", name: "Maple x 30 - Blancos", description: "Clásicos y frescos, calidad garantizada.", price: 4200, active: true },
];

export default async function ProductosPage() {
  let products = [];
  try {
    products = await prisma.product.findMany({
      where: { active: true },
      orderBy: { name: 'asc' }
    });
    if (products.length === 0) products = MOCK_PRODUCTS;
  } catch (e) {
    console.log("Modo Demo: Usando productos de prueba.");
    products = MOCK_PRODUCTS;
  }

  return (
    <div className="container mx-auto px-4 py-12 flex-1">
      <div className="flex flex-col items-center text-center mb-12">
        <Egg className="w-12 h-12 text-nature-600 mb-4" />
        <h1 className="font-serif text-4xl font-bold mb-4 text-kraft-900">
          Nuestros Productos
        </h1>
        <p className="text-kraft-700 max-w-2xl text-lg">
          Huevos frescos de gallinas de campo, alimentadas con maíz y libres de estrés.
          Elige el tamaño que mejor se adapte a tus necesidades.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            id={product.id}
            name={product.name}
            description={product.description}
            price={product.price}
            imageUrl={product.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}
