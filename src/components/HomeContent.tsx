"use client";

import { ShoppingBasket, Truck, ShieldCheck, MapPin, Egg, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import dynamic from 'next/dynamic';
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";

const ShippingMapLandingWrapper = dynamic(() => import('@/components/ShippingMapLandingWrapper'), { ssr: false });

interface HomeContentProps {
  products: any[];
  shippingZones: any[];
}

export default function HomeContent({ products, shippingZones }: HomeContentProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[#fdfbf7]">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="/hero-bg.png" 
              alt="Fondo gallinas de campo" 
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
            <div className="absolute inset-0 bg-black/40 z-10" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#fdfbf7] z-10" />
          </div>
          
          <div className="container relative z-20 mx-auto px-4 text-center text-white">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >

              <h1 className="text-6xl md:text-9xl font-black mb-8 tracking-tighter leading-none">
                DON LUCAS
              </h1>
              <p className="text-2xl md:text-3xl mb-12 max-w-3xl mx-auto text-gray-200 font-light italic leading-relaxed">
                "Huevos de campo frescos, nutridos con libertad y el sol de Mendoza."
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link
                  href="/productos"
                  className="bg-[#4a7c44] hover:bg-white hover:text-[#2d5a27] text-white px-12 py-5 rounded-full font-black text-xl transition-all transform hover:scale-110 shadow-[0_20px_50px_rgba(45,90,39,0.3)] flex items-center gap-3"
                >
                  <ShoppingBasket className="w-6 h-6" />
                  PEDIR AHORA
                </Link>
                <Link
                  href="#zonas"
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-12 py-5 rounded-full font-bold text-xl transition-all"
                >
                  Ver Zonas
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features / Benefits */}
        <section id="beneficios" className="py-24 bg-[#fdfbf7]">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-3xl bg-nature-100 flex items-center justify-center mb-8 rotate-3 hover:rotate-0 transition-transform">
                  <Truck className="w-10 h-10 text-nature-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Entrega Express</h3>
                <p className="text-gray-600 text-lg">Del nido a tu puerta en menos de 24hs para máxima frescura.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-3xl bg-nature-100 flex items-center justify-center mb-8 -rotate-3 hover:rotate-0 transition-transform">
                  <ShieldCheck className="w-10 h-10 text-nature-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Calidad Premium</h3>
                <p className="text-gray-600 text-lg">Gallinas libres de jaula, alimentadas 100% de forma natural.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-3xl bg-nature-100 flex items-center justify-center mb-8 rotate-6 hover:rotate-0 transition-transform">
                  <Egg className="w-10 h-10 text-nature-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Sabor Auténtico</h3>
                <p className="text-gray-600 text-lg">Sentí la diferencia de un huevo con yema dorada y nutritiva.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-32 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20">
              <div className="max-w-2xl">
                <h2 className="text-5xl font-black text-gray-900 mb-6 leading-tight">Nuestra Cosecha del Día</h2>
                <div className="w-24 h-2 bg-nature-600 rounded-full"></div>
              </div>
              <Link href="/productos" className="mt-8 md:mt-0 flex items-center gap-2 text-nature-600 font-black text-xl hover:gap-4 transition-all">
                Ver Catálogo Completo <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {products.length > 0 ? (
                products.map((p) => <ProductCard key={p.id} {...p} />)
              ) : (
                <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <p className="text-2xl text-gray-400 font-medium italic">Buscando los mejores huevos para vos...</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Sobre Nosotros */}
        <section id="nosotros" className="py-32 bg-[#fdfbf7]">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="md:w-1/2">
                <div className="rounded-[3rem] overflow-hidden shadow-2xl relative h-[500px]">
                  <img 
                    src="/nosotros-bg.png" 
                    alt="Gallinas felices" 
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div className="md:w-1/2 space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-nature-100 border border-nature-200 text-nature-800">
                  <Egg className="w-4 h-4" />
                  <span className="text-xs font-bold tracking-widest uppercase">Nuestra Historia</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                  Criados con amor, del campo a tu mesa
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  En Don Lucas, creemos que la calidad de un huevo comienza con la felicidad de la gallina. Nuestras aves viven en libertad, disfrutando del sol y el pasto de Mendoza, lo que resulta en huevos de yema dorada, sabor intenso y alto valor nutricional.
                </p>
                <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-3xl font-black text-nature-600">100%</p>
                    <p className="text-sm text-gray-500 font-bold uppercase">Naturales</p>
                  </div>
                  <div className="w-px h-12 bg-gray-200"></div>
                  <div className="text-center">
                    <p className="text-3xl font-black text-nature-600">+5</p>
                    <p className="text-sm text-gray-500 font-bold uppercase">Años de Exp.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section id="zonas" className="py-32 bg-[#2d5a27] relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center text-white mb-20">
              <h2 className="text-5xl font-black mb-8">¿Llegamos a tu Hogar?</h2>
              <p className="text-xl text-nature-100 opacity-90">
                Explorá nuestro mapa interactivo para ver las zonas de cobertura y puntos de retiro.
              </p>
            </div>
            <div className="rounded-[3rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.4)] border-[12px] border-white/10 bg-white h-[650px] relative">
              <ShippingMapLandingWrapper zones={shippingZones} />
            </div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-nature-900/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
        </section>

        {/* Contacto */}
        <section id="contacto" className="py-24 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-black text-gray-900 mb-8">¿Tienes alguna duda?</h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Estamos aquí para ayudarte. Si tienes preguntas sobre nuestros productos, pedidos por mayor o zonas de entrega, escribinos.
            </p>
            <div className="inline-flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="https://wa.me/5491100000000" target="_blank" rel="noreferrer" className="bg-[#25D366] hover:bg-[#1DA851] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center gap-3">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                Chatear por WhatsApp
              </a>
              <a href="mailto:hola@donlucas.com" className="bg-kraft-100 hover:bg-kraft-200 text-kraft-900 border border-kraft-200 px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center gap-3">
                Enviar un Email
              </a>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
