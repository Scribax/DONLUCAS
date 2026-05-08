"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Egg } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al registrarse");
      }

      // Redirigir al login
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 flex-1 flex flex-col justify-center items-center py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-sm border border-kraft-200">
        <div className="flex flex-col items-center mb-8">
          <Egg className="w-12 h-12 text-nature-600 mb-2" />
          <h1 className="font-serif text-3xl font-bold text-kraft-900">Crear Cuenta</h1>
          <p className="text-kraft-700 text-sm mt-1">Suma puntos con cada compra</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-kraft-700 mb-1">Nombre Completo</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 border border-kraft-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nature-600"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-kraft-700 mb-1">Correo Electrónico</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 border border-kraft-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nature-600"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-kraft-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-3 border border-kraft-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nature-600"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-nature-600 hover:bg-nature-600/90 text-white font-bold py-3 rounded-xl transition mt-4 disabled:opacity-70"
          >
            {loading ? "Creando cuenta..." : "Registrarme"}
          </button>
        </form>

        <p className="text-center text-sm text-kraft-700 mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-kraft-900 font-bold hover:underline">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
