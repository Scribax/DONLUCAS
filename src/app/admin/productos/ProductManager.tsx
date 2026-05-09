"use client";

import { useState } from "react";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Image as ImageIcon, 
  Package, 
  DollarSign, 
  Save, 
  X 
} from "lucide-react";
import Image from "next/image";

export default function ProductManager({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const openForm = (product: any = null) => {
    setCurrentProduct(product || { name: "", description: "", price: "", stock: "", imageUrl: "", weight: "" });
    setIsEditing(true);
  };

  const closeForm = () => {
    setIsEditing(false);
    setCurrentProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const isNew = !currentProduct.id;
    const url = isNew ? "/api/products" : `/api/products/${currentProduct.id}`;
    const method = isNew ? "POST" : "PATCH";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentProduct)
      });

      if (!res.ok) throw new Error("Error guardando");
      
      const savedProduct = await res.json();
      
      if (isNew) {
        setProducts([...products, savedProduct]);
      } else {
        setProducts(products.map(p => p.id === savedProduct.id ? savedProduct : p));
      }
      closeForm();
    } catch (err) {
      alert("Error al guardar el producto");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen es muy grande. El límite es 5MB.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error al subir imagen");
      
      const data = await res.json();
      setCurrentProduct({ ...currentProduct, imageUrl: data.url });
    } catch (error) {
      console.error(error);
      alert("Hubo un error al subir la imagen.");
    } finally {
      setIsUploading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("¿Seguro que quieres eliminar este producto?")) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      alert("Error al eliminar");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-kraft-100">
        <div>
          <h1 className="font-serif text-3xl font-bold text-kraft-900">Gestión de Productos</h1>
          <p className="text-kraft-600">Añade, edita o elimina productos del catálogo.</p>
        </div>
        <button 
          onClick={() => openForm()}
          className="bg-nature-600 hover:bg-nature-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition shadow-md"
        >
          <Plus className="w-5 h-5" />
          Nuevo Producto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-kraft-200 overflow-hidden flex flex-col group">
            <div className="relative h-40 bg-kraft-50 flex items-center justify-center">
              {product.imageUrl ? (
                <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
              ) : (
                <ImageIcon className="w-12 h-12 text-kraft-200" />
              )}
            </div>
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-kraft-900">{product.name}</h3>
                <span className="font-bold text-nature-600 text-xl">${product.price}</span>
              </div>
              <p className="text-kraft-600 text-sm mb-4 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-kraft-100">
                <span className="text-xs font-bold text-kraft-400">Stock: {product.stock}</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => openForm(product)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => deleteProduct(product.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Edición/Creación */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-kraft-900 p-6 text-white flex justify-between items-center flex-shrink-0">
              <h2 className="font-serif text-xl font-bold">
                {currentProduct.id ? "Editar Producto" : "Nuevo Producto"}
              </h2>
              <button onClick={closeForm} className="hover:bg-kraft-800 p-2 rounded-full transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-kraft-700 mb-1">Nombre del Producto</label>
                  <input 
                    required
                    type="text" 
                    value={currentProduct.name}
                    onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})}
                    className="w-full p-3 border border-kraft-200 rounded-xl focus:ring-2 focus:ring-nature-600 outline-none"
                    placeholder="Ej: Maple de 30 Huevos Grandes"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-kraft-700 mb-1">Descripción</label>
                  <textarea 
                    required
                    value={currentProduct.description}
                    onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})}
                    className="w-full p-3 border border-kraft-200 rounded-xl focus:ring-2 focus:ring-nature-600 outline-none h-24"
                    placeholder="Describe el producto..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-kraft-700 mb-1 flex items-center gap-1">
                    <DollarSign className="w-4 h-4" /> Precio ($)
                  </label>
                  <input 
                    required
                    type="number" 
                    value={currentProduct.price}
                    onChange={e => setCurrentProduct({...currentProduct, price: e.target.value})}
                    className="w-full p-3 border border-kraft-200 rounded-xl focus:ring-2 focus:ring-nature-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-kraft-700 mb-1 flex items-center gap-1">
                    <Package className="w-4 h-4" /> Stock Inicial
                  </label>
                  <input 
                    required
                    type="number" 
                    value={currentProduct.stock}
                    onChange={e => setCurrentProduct({...currentProduct, stock: e.target.value})}
                    className="w-full p-3 border border-kraft-200 rounded-xl focus:ring-2 focus:ring-nature-600 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-kraft-700 mb-2">Imagen del Producto</label>
                  <div className="flex gap-4 items-start">
                    {currentProduct.imageUrl && (
                      <div className="w-24 h-24 relative rounded-xl overflow-hidden border border-kraft-200 flex-shrink-0 shadow-sm">
                        <Image src={currentProduct.imageUrl} alt="Preview" fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1 space-y-3">
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={isUploading}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className={`w-full p-4 border-2 border-dashed border-nature-600 rounded-xl flex items-center justify-center gap-2 text-nature-600 bg-nature-50 hover:bg-nature-100 transition shadow-sm ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          <ImageIcon className="w-5 h-5" />
                          <span className="font-bold">{isUploading ? "Subiendo archivo..." : "Subir foto desde tu dispositivo"}</span>
                        </div>
                      </div>
                      <input 
                        type="text" 
                        value={currentProduct.imageUrl}
                        onChange={e => setCurrentProduct({...currentProduct, imageUrl: e.target.value})}
                        className="w-full p-3 text-sm border border-kraft-200 rounded-xl focus:ring-2 focus:ring-nature-600 outline-none"
                        placeholder="O puedes pegar el enlace (URL) de una imagen..."
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-kraft-700 mb-1">Peso / Cantidad (opcional)</label>
                  <input 
                    type="text" 
                    value={currentProduct.weight}
                    onChange={e => setCurrentProduct({...currentProduct, weight: e.target.value})}
                    className="w-full p-3 border border-kraft-200 rounded-xl focus:ring-2 focus:ring-nature-600 outline-none"
                    placeholder="Aprox. 1.8kg"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={closeForm}
                  className="flex-1 bg-kraft-50 text-kraft-900 font-bold py-4 rounded-xl hover:bg-kraft-100 transition"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-nature-600 text-white font-bold py-4 rounded-xl hover:bg-nature-700 transition shadow-md flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {isLoading ? "Guardando..." : "Guardar Producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
