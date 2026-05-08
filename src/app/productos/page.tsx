import ProductCard from "@/components/ProductCard";
import { Egg } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Catálogo de Productos | DON LUCAS",
  description: "Compra huevos marrones de gallinas de campo frescos y naturales en San Rafael.",
};

export default async function ProductosPage() {
  let products = [];
  try {
    products = await prisma.product.findMany({
      orderBy: { name: 'asc' }
    });
  } catch (e) {
    console.error("DB connection failed during build");
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {products.length > 0 ? (
          products.map(product => (
            <ProductCard 
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              imageUrl={product.imageUrl || undefined}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-kraft-50 rounded-3xl border border-dashed border-kraft-200">
            <p className="text-kraft-500 font-bold mb-4">Aún no hay productos cargados en el sistema.</p>
            <p className="text-sm text-kraft-400">Si eres administrador, entra al panel para añadir tu primer producto.</p>
          </div>
        )}
      </div>
    </div>
  );
}
