"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Egg } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Credenciales inválidas. Por favor intenta de nuevo.");
      setLoading(false);
    } else {
      router.push("/cuenta");
      router.refresh();
    }
  };

  return (
    <div className="container mx-auto px-4 flex-1 flex flex-col justify-center items-center py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-sm border border-kraft-200">
        <div className="flex flex-col items-center mb-8">
          <Egg className="w-12 h-12 text-nature-600 mb-2" />
          <h1 className="font-serif text-3xl font-bold text-kraft-900">Iniciar Sesión</h1>
          <p className="text-kraft-700 text-sm mt-1">Accede a tu cuenta de Don Lucas</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center border border-red-200">
            {error}
          </div>
        )}

        <Link
          href="/checkout"
          className="w-full border-2 border-nature-600 text-nature-600 hover:bg-nature-50 font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 mb-6 shadow-sm"
        >
          Continuar como Invitado
        </Link>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-kraft-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-kraft-500 uppercase tracking-widest font-bold text-[10px]">O inicia sesión</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-kraft-700 mb-1">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-kraft-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nature-600"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-kraft-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-kraft-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nature-600"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-kraft-900 hover:bg-kraft-700 text-white font-bold py-4 rounded-xl transition mt-4 disabled:opacity-70 shadow-lg"
          >
            {loading ? "Iniciando..." : "Entrar a mi cuenta"}
          </button>
        </form>

        <p className="text-center text-sm text-kraft-700 mt-8">
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="text-nature-600 font-bold hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
