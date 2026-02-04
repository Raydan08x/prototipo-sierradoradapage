import { useState, useEffect } from 'react';
import { api as supabase } from '../../lib/api';
import { Plus, Trash2, AlertCircle, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  is_available: boolean;
  abv?: number;
  ibu?: number;
}

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    description: '',
    image_url: '',
    is_available: true,
    abv: 0,
    ibu: 0
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('products')
        .insert([newProduct]);

      if (error) throw error;

      toast.success('Producto agregado correctamente');
      setShowAddModal(false);
      setNewProduct({
        name: '',
        price: 0,
        description: '',
        image_url: '',
        is_available: true,
        abv: 0,
        ibu: 0
      });
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Error al agregar producto');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Producto eliminado');
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error al eliminar producto');
    }
  };

  const toggleAvailability = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_available: !product.is_available })
        .eq('id', product.id);

      if (error) throw error;

      toast.success(`Producto ${!product.is_available ? 'activado' : 'desactivado'}`);
      setProducts(products.map(p =>
        p.id === product.id ? { ...p, is_available: !p.is_available } : p
      ));
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Error al actualizar estado');
    }
  };

  if (loading) return <div>Cargando catálogo...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#E5E1E6]">Gestión de Productos</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[#B3A269] text-[#222223] rounded-lg hover:bg-[#B3A269]/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo Producto
        </button>
      </div>

      <div className="bg-[#2A2A2B] rounded-lg overflow-hidden shadow-lg border border-[#B3A269]/10">
        <table className="w-full">
          <thead className="bg-[#222223]">
            <tr>
              <th className="px-6 py-4 text-left text-[#B3A269] font-medium">Nombre</th>
              <th className="px-6 py-4 text-left text-[#B3A269] font-medium">Precio</th>
              <th className="px-6 py-4 text-left text-[#B3A269] font-medium">Estado</th>
              <th className="px-6 py-4 text-left text-[#B3A269] font-medium">Detalles</th>
              <th className="px-6 py-4 text-right text-[#B3A269] font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#B3A269]/10">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-[#222223]/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {product.image_url && (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-10 h-10 rounded-full object-cover border border-[#B3A269]/20"
                      />
                    )}
                    <span className="text-[#E5E1E6] font-medium">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-[#E5E1E6]">
                  ${product.price ? product.price.toLocaleString() : '0'}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleAvailability(product)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${product.is_available
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}
                  >
                    {product.is_available ? (
                      <>
                        <Check className="w-3 h-3" /> Disponible
                      </>
                    ) : (
                      <>
                        <X className="w-3 h-3" /> Agotado
                      </>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 text-gray-400 text-sm">
                  ABV: {product.abv}% | IBU: {product.ibu}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-full transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  No hay productos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#2A2A2B] rounded-xl max-w-lg w-full p-6 border border-[#B3A269]/20 shadow-2xl">
            <h3 className="text-xl font-bold text-[#E5E1E6] mb-6 border-b border-[#B3A269]/20 pb-4">Nuevo Producto</h3>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#E5E1E6] mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full bg-[#222223] text-[#E5E1E6] rounded-lg p-2.5 border border-[#B3A269]/20 focus:border-[#B3A269] focus:outline-none placeholder-gray-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#E5E1E6] mb-1">Precio</label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full bg-[#222223] text-[#E5E1E6] rounded-lg p-2.5 border border-[#B3A269]/20 focus:border-[#B3A269] focus:outline-none placeholder-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#E5E1E6] mb-1">URL Imagen</label>
                  <input
                    type="text"
                    value={newProduct.image_url}
                    onChange={e => setNewProduct({ ...newProduct, image_url: e.target.value })}
                    className="w-full bg-[#222223] text-[#E5E1E6] rounded-lg p-2.5 border border-[#B3A269]/20 focus:border-[#B3A269] focus:outline-none placeholder-gray-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#E5E1E6] mb-1">ABV (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newProduct.abv}
                    onChange={e => setNewProduct({ ...newProduct, abv: Number(e.target.value) })}
                    className="w-full bg-[#222223] text-[#E5E1E6] rounded-lg p-2.5 border border-[#B3A269]/20 focus:border-[#B3A269] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#E5E1E6] mb-1">IBU</label>
                  <input
                    type="number"
                    value={newProduct.ibu}
                    onChange={e => setNewProduct({ ...newProduct, ibu: Number(e.target.value) })}
                    className="w-full bg-[#222223] text-[#E5E1E6] rounded-lg p-2.5 border border-[#B3A269]/20 focus:border-[#B3A269] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#E5E1E6] mb-1">Descripción</label>
                <textarea
                  value={newProduct.description}
                  onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                  rows={3}
                  className="w-full bg-[#222223] text-[#E5E1E6] rounded-lg p-2.5 border border-[#B3A269]/20 focus:border-[#B3A269] focus:outline-none placeholder-gray-600"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#B3A269]/20">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-[#E5E1E6] hover:text-[#B3A269] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#B3A269] text-[#222223] font-bold rounded-lg hover:bg-[#B3A269]/90 transition-colors"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProductManagement;