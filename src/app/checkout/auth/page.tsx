import { User, UserPlus, ShoppingBag, Award, Clock, Gift } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "¿Cómo quieres continuar? | DON LUCAS",
};

export default function CheckoutAuthPage() {
  return (
    <div className="container mx-auto px-4 py-20 flex-1 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Columna Derecha: Invitado (La movemos arriba en móvil para máxima visibilidad) */}
        <div className="order-1 md:order-2 bg-kraft-50 p-8 rounded-3xl border-2 border-dashed border-kraft-300 flex flex-col justify-center text-center animate-in fade-in slide-in-from-top duration-500">
          <div className="bg-white w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto shadow-sm">
            <ShoppingBag className="w-6 h-6 text-kraft-400" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-kraft-800 mb-2">¿Tienes prisa?</h2>
          <p className="text-kraft-600 text-sm mb-6">
            Compra como invitado y procesaremos tu pedido al instante.
          </p>
          
          <Link 
            href="/checkout" 
            className="w-full bg-white border-2 border-kraft-900 text-kraft-900 font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-kraft-900 hover:text-white transition shadow-sm"
          >
            Continuar como invitado
            <ShoppingBag className="w-5 h-5" />
          </Link>
        </div>

        {/* Columna Izquierda: Registro / Login */}
        <div className="order-2 md:order-1 bg-white p-8 rounded-3xl shadow-xl border border-kraft-200 flex flex-col animate-in fade-in slide-in-from-bottom duration-700">
          <div className="bg-nature-600/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
            <Award className="w-8 h-8 text-nature-600" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-kraft-900 mb-4">Suma puntos</h2>
          <p className="text-kraft-700 mb-8 text-sm">
            Acumula puntos Don Lucas con esta compra y canjéalos por productos gratis.
          </p>

          <div className="space-y-4 mb-8 flex-1">
            <div className="flex items-center gap-3 text-xs font-bold text-kraft-800">
              <Gift className="w-4 h-4 text-nature-600" />
              <span>Canjea puntos por maples de regalo</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold text-kraft-800">
              <Clock className="w-4 h-4 text-nature-600" />
              <span>Guarda tus direcciones favoritas</span>
            </div>
          </div>

          <div className="space-y-3">
            <Link 
              href="/registro?callbackUrl=/checkout" 
              className="w-full bg-nature-600 hover:bg-nature-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-nature-600/20"
            >
              <UserPlus className="w-5 h-5" />
              Crear mi cuenta ahora
            </Link>
            <Link 
              href="/login?callbackUrl=/checkout" 
              className="w-full bg-white hover:bg-kraft-50 text-kraft-900 border border-kraft-200 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition"
            >
              <User className="w-5 h-5" />
              Ya tengo cuenta, ingresar
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
