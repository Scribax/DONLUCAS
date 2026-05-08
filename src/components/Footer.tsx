import Link from "next/link";
import { Camera, MapPin, Clock, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-kraft-900 text-kraft-200 font-sans py-12 mt-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Marca */}
        <div>
          <h3 className="font-serif text-2xl font-bold text-kraft-50 mb-4 tracking-wider">
            DON LUCAS
          </h3>
          <p className="mb-4">
            Huevos marrones de gallinas de campo. Frescos, naturales y entregados directo en tu casa en San Rafael, Mendoza.
          </p>
          <div className="flex gap-4">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-kraft-50 transition">
              <Camera className="w-6 h-6" />
            </a>
          </div>
        </div>

        {/* Contacto e Info */}
        <div>
          <h4 className="font-bold text-lg text-kraft-50 mb-4">Contacto</h4>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <span>+54 9 260 4123456</span> {/* Ejemplo */}
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>San Rafael, Mendoza, Argentina</span>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>Lunes a Sábado - 8:00 a 13:00 / 16:00 a 20:00</span>
            </li>
          </ul>
        </div>

        {/* Enlaces Útiles */}
        <div>
          <h4 className="font-bold text-lg text-kraft-50 mb-4">Enlaces Rápidos</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/productos" className="hover:text-kraft-50 transition">Comprar Huevos</Link>
            </li>
            <li>
              <Link href="/cuenta" className="hover:text-kraft-50 transition">Mi Cuenta</Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-kraft-50 transition">Admin Panel</Link>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-kraft-700 mt-8 pt-8 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Don Lucas. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
