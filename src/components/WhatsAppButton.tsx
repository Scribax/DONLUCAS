import { Phone } from "lucide-react";

export default function WhatsAppButton() {
  const phoneNumber = "5492604123456"; // Ejemplo
  const message = encodeURIComponent("¡Hola! Quiero comprar huevos de campo.");

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-xl hover:bg-[#20bd5a] hover:scale-110 transition-transform duration-300 flex items-center justify-center"
      aria-label="Hablar por WhatsApp"
    >
      <Phone className="w-8 h-8 fill-current" />
    </a>
  );
}
