import Link from "next/link";
import { 
  ArrowRight, 
  MessageCircle, 
  Leaf, 
  Bird, 
  ShoppingBasket, 
  Truck, 
  Egg,
  MapPin
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";

import ShippingMapLandingWrapper from '@/components/ShippingMapLandingWrapper';

export default async function Home() {
  const featuredProducts = await prisma.product.findMany({ take: 3 });
  const shippingZones = await prisma.shippingZone.findMany({
    orderBy: { price: 'asc' }
  });

  return (
    <div className="flex flex-col w-full">
      {/* ... HERO y BENEFICIOS ... */}
      
      {/* HERO SECTION */}
      <section className="relative w-full min-h-screen flex flex-col justify-center items-center text-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform-gpu"
          style={{ backgroundImage: `url('/hero-bg.png')` }}
        >
          {/* Simple dark overlay for better performance */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 max-w-5xl transform-gpu">
          <div className="flex items-center justify-center gap-4 mb-4 animate-in fade-in duration-500">
             <div className="h-[1px] w-12 bg-nature-200/50"></div>
             <Egg className="w-8 h-8 text-nature-200" />
             <div className="h-[1px] w-12 bg-nature-200/50"></div>
          </div>
          
          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-black text-white mb-4 tracking-tighter animate-in fade-in slide-in-from-bottom-4 duration-700">
            DON LUCAS
          </h1>
          
          <h2 className="font-serif text-2xl md:text-4xl text-[#D9F99D] font-bold mb-8 uppercase tracking-[0.4em] animate-in fade-in slide-in-from-bottom-6 duration-700">
            Huevos de campo frescos
          </h2>
          
          <p className="font-sans text-lg md:text-2xl text-white max-w-3xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700">
            Huevos marrones de gallinas criadas en libertad.<br />
            Frescos, naturales y entregados en tu casa en <span className="text-nature-200 font-bold underline decoration-wavy">San Rafael</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-in fade-in slide-in-from-bottom-10 duration-700">
            <Link
              href="/productos"
              className="group bg-nature-600 hover:bg-nature-500 text-white font-black py-5 px-10 rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 text-lg flex items-center gap-3"
            >
              Comprar ahora
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="https://wa.me/5492604123456?text=Hola,%20quiero%20comprar%20huevos%20Don%20Lucas"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 font-black py-5 px-10 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 text-lg flex items-center gap-3"
            >
              <MessageCircle className="w-5 h-5" />
              Hablar por WhatsApp
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
           <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center p-1">
              <div className="w-1 h-2 bg-white/50 rounded-full"></div>
           </div>
        </div>
      </section>

      {/* SECCIÓN DE BENEFICIOS */}
      <section id="beneficios" className="py-24 px-4 bg-kraft-50 relative">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { 
                icon: Leaf, 
                title: "100% Naturales", 
                desc: "Gallinas alimentadas de forma natural sin hormonas ni químicos." 
              },
              { 
                icon: Bird, 
                title: "Bienestar animal", 
                desc: "Nuestras gallinas viven libres en espacios abiertos." 
              },
              { 
                icon: ShoppingBasket, 
                title: "Frescura garantizada", 
                desc: "Recolectamos los huevos diariamente para que lleguen frescos." 
              },
              { 
                icon: Truck, 
                title: "Envío a domicilio", 
                desc: "Entregamos en San Rafael para que no salgas de casa." 
              },
            ].map((benefit, idx) => (
              <div key={idx} className="group bg-white p-10 rounded-[40px] shadow-sm border border-kraft-100 flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
                <div className="bg-nature-50 p-6 rounded-3xl mb-6 group-hover:bg-nature-600 transition-colors duration-500">
                  <benefit.icon className="w-10 h-10 text-nature-600 group-hover:text-white transition-colors duration-500" />
                </div>
                <h4 className="font-serif text-xl font-bold text-kraft-900 mb-4">{benefit.title}</h4>
                <p className="text-kraft-600 text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* PRODUCTOS DESTACADOS */}
      <section id="productos" className="py-20 px-4 bg-white text-kraft-900">
        <div className="container mx-auto">
          <h3 className="font-serif text-3xl md:text-4xl font-bold text-center mb-4">Nuestros Productos</h3>
          <p className="text-center text-kraft-700 mb-12 max-w-2xl mx-auto">Huevos frescos de la mejor calidad. Selecciona tu formato ideal y te lo llevamos a casa.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {featuredProducts.length > 0 ? (
              featuredProducts.map(product => (
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
              <p className="col-span-full text-center text-kraft-500 italic">Cargando productos...</p>
            )}
          </div>
        </div>
      </section>

      {/* ZONAS DE ENVÍO DINÁMICAS */}
      <section id="zonas" className="py-20 px-4 bg-kraft-900 text-kraft-50">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h3 className="font-serif text-3xl md:text-4xl font-bold mb-6">Zonas de Entrega</h3>
              <p className="text-lg text-kraft-200 mb-6">
                Descubre nuestras zonas de cobertura en San Rafael. El costo de envío se actualiza según tu ubicación.
              </p>
              
              <ul className="space-y-4 mb-8">
                {shippingZones.length > 0 ? (
                  shippingZones.map((zone) => (
                    <li key={zone.id} className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition cursor-default">
                      <div className="bg-nature-600 p-2 rounded-full shadow-lg">
                        <MapPin className="w-5 h-5 text-white"/>
                      </div>
                      <div>
                        <span className="font-bold block text-white">{zone.name}:</span>
                        <span className="text-nature-300 font-bold">
                          {zone.price === 0 ? "Envío Gratis ($0)" : `Envío: $${zone.price}`}
                        </span>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-kraft-400 italic">No hay zonas configuradas todavía.</li>
                )}
                <li className="flex items-center gap-3 p-4">
                  <div className="bg-kraft-700 p-2 rounded-full"><MapPin className="w-5 h-5 text-white"/></div>
                  <div>
                    <span className="font-bold block">Otras zonas:</span>
                    <span className="text-kraft-300 italic text-sm text-balance">Si estás fuera de las zonas marcadas, consultanos en el checkout.</span>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="w-full h-[400px] md:h-[500px] shadow-2xl relative z-10">
               <ShippingMapLandingWrapper zones={shippingZones} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
