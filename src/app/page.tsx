import { prisma } from "@/lib/prisma";
import { ShoppingBasket, Truck, ShieldCheck, MapPin, Egg } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import dynamic from 'next/dynamic';
import ProductCard from "@/components/ProductCard";
import WhatsAppButton from "@/components/WhatsAppButton";

const ShippingMapLandingWrapper = dynamic(() => import('@/components/ShippingMapLandingWrapper'), { ssr: false });

export const dynamic = 'force-dynamic';

export default async function Home() {
  let products = [];
  let shippingZones = [];

  try {
    products = await prisma.product.findMany({
      where: { active: true },
      take: 4,
    });
    shippingZones = await prisma.shippingZone.findMany();
  } catch (e) {
    console.error("DB connection failed during build/render");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[600px] flex items-center justify-center overflow-hidden bg-[#2d5a27]">
          <div className="absolute inset-0 z-0 opacity-50">
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent z-10" />
          </div>
          
          <div className="container relative z-10 mx-auto px-4 text-center text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
              <Egg className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium tracking-wide uppercase">Directo del campo a tu mesa</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              Don Lucas <br />
              <span className="text-[#a5d6a7]">Huevos de Campo</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto text-gray-200 leading-relaxed">
              Frescura garantizada y la mejor calidad en cada entrega. 
              Sabor natural y compromiso con el bienestar animal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/productos"
                className="bg-[#4a7c44] hover:bg-[#3d6638] text-white px-10 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-xl flex items-center gap-2"
              >
                <ShoppingBasket className="w-5 h-5" />
                Comprar Ahora
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-24 container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuestros Destacados</h2>
              <div className="w-20 h-1.5 bg-[#4a7c44] rounded-full"></div>
            </div>
          </div>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500">Cargando productos...</p>
            </div>
          )}
        </section>

        {/* Map Section */}
        <section id="zonas-envio" className="py-24 bg-gray-50 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">¿Llegamos a tu zona?</h2>
              <p className="text-lg text-gray-600">
                Mirá nuestro mapa interactivo para ver las zonas de entrega.
              </p>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-white h-[600px] relative">
              <ShippingMapLandingWrapper zones={shippingZones} />
            </div>
          </div>
        </section>
      </main>
      
      <WhatsAppButton />
    </div>
  );
}
