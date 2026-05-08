import { CheckCircle2, MessageCircle, PackageOpen } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Pedido Confirmado | DON LUCAS",
};

export default function CheckoutExitoPage() {
  return (
    <div className="container mx-auto px-4 py-20 flex-1 flex flex-col justify-center items-center">
      <div className="w-full max-w-lg bg-white p-10 rounded-3xl shadow-sm border border-kraft-200 text-center">
        <div className="bg-nature-600/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12 text-nature-600" />
        </div>
        
        <h1 className="font-serif text-3xl font-bold text-kraft-900 mb-4">¡Pedido Registrado!</h1>
        <p className="text-kraft-700 mb-8 text-lg">
          Hemos guardado tu pedido. Actualmente se encuentra en estado <span className="font-bold bg-orange-100 text-orange-700 px-2 py-1 rounded">PENDIENTE</span>.
        </p>

        <div className="bg-kraft-50 p-6 rounded-2xl border border-kraft-200 mb-8">
          <h2 className="font-bold text-kraft-900 mb-2 flex items-center justify-center gap-2">
            <MessageCircle className="w-5 h-5 text-[#25D366]" />
            ¿Pudiste enviar el WhatsApp?
          </h2>
          <p className="text-sm text-kraft-700 mb-4">
            Recuerda que debes enviarnos el mensaje por WhatsApp para que comencemos a preparar tu pedido y coordinemos el pago.
          </p>
          <p className="text-xs text-kraft-500 font-bold">
            Si no se abrió automáticamente, no te preocupes, tu pedido ya está guardado.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link 
            href="/cuenta" 
            className="w-full bg-kraft-900 hover:bg-kraft-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition"
          >
            <PackageOpen className="w-5 h-5" />
            Ver el estado de mi pedido
          </Link>
          <Link 
            href="/" 
            className="w-full bg-white hover:bg-kraft-50 text-kraft-900 border border-kraft-200 font-bold py-4 rounded-xl transition"
          >
            Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  );
}
