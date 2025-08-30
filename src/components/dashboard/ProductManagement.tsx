import React from 'react';
import { Plus } from 'lucide-react';

const ProductManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#E5E1E6]">Gestión de Productos</h2>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Nuevo Producto
        </button>
      </div>

      <div className="bg-[#2A2A2B] rounded-lg p-6">
        <p className="text-[#E5E1E6]">Contenido de gestión de productos</p>
      </div>
    </div>
  );
};

export default ProductManagement;