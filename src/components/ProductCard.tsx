"use client";

import Image from "next/image";
import { ShoppingCart, Check } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

export default function ProductCard({ id, name, description, price, imageUrl }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({ id, name, price, quantity: 1, imageUrl });
    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-kraft-200 overflow-hidden flex flex-col hover:shadow-lg transition group">
      <div className="relative h-48 w-full bg-kraft-50 flex items-center justify-center p-4">
        {imageUrl ? (
          <Image src={imageUrl} alt={name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="text-kraft-500 font-serif italic">Imagen referencial</div>
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h4 className="font-serif font-bold text-xl mb-2 text-kraft-900">{name}</h4>
        <p className="text-kraft-700 text-sm mb-4 flex-1">{description}</p>
        <div className="flex items-center justify-between mt-auto">
          <span className="font-bold text-2xl text-nature-600">${price}</span>
          <button 
            onClick={handleAdd}
            className={`${added ? 'bg-nature-600' : 'bg-kraft-900 hover:bg-kraft-700'} text-white p-3 rounded-full transition shadow-md`}
          >
            {added ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
