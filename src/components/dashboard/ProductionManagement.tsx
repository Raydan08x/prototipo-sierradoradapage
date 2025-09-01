import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { supabase } from '../../lib/supabase';
import { Plus, Save, Edit, Trash2, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

// Types
interface RawMaterial {
  id: string;
  name: string;
  type: string;
  unit: string;
  stock_quantity: number;
  min_stock: number;
  supplier_id: string;
  unit_cost: number;
  last_purchase_date: string;
}

interface Recipe {
  id: string;
  name: string;
  style: string;
  description: string;
  og: number;
  fg: number;
  abv: number;
  ibu: number;
  srm: number;
  batch_size: number;
  efficiency: number;
  ingredients: RecipeIngredient[];
}

interface RecipeIngredient {
  id?: string;
  name: string;
  type: string;
  amount: number;
  unit: string;
  timing?: number | null;
  alpha_acid?: number | null;
}

interface ProductionBatch {
  id: string;
  recipe_id: string;
  planned_start_date: string;
  planned_end_date: string;
  status: string;
  batch_size: number;
}

const ProductionManagement = () => {
  const [materials, setMaterials] = useState<RawMaterial[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [batches, setBatches] = useState<ProductionBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewRecipeModal, setShowNewRecipeModal] = useState(false);
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [newRecipe, setNewRecipe] = useState<Partial<Recipe>>({
    name: '',
    style: '',
    description: '',
    og: 1.050,
    fg: 1.010,
    abv: 5.0,
    ibu: 20,
    srm: 5,
    batch_size: 300,
    efficiency: 75,
    ingredients: []
  });
  const [newMaterial, setNewMaterial] = useState<Partial<RawMaterial>>({
    name: '',
    type: 'malt',
    unit: 'kg',
    stock_quantity: 0,
    min_stock: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch raw materials
      const { data: materialsData, error: materialsError } = await supabase
        .from('raw_materials')
        .select('*')
        .order('name');

      if (materialsError) throw materialsError;
      setMaterials(materialsData);

      // Fetch recipes with ingredients
      const { data: recipesData, error: recipesError } = await supabase
        .from('beer_recipes')
        .select(`
          *,
          recipe_ingredients (*)
        `)
        .eq('status', 'active');

      if (recipesError) throw recipesError;
      setRecipes(recipesData);

      // Fetch production batches
      const { data: batchesData, error: batchesError } = await supabase
        .from('production_schedule')
        .select('*')
        .order('planned_start_date', { ascending: true });

      if (batchesError) throw batchesError;
      setBatches(batchesData);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error al cargar los datos de producción');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMaterial = async () => {
    try {
      if (!newMaterial.name || !newMaterial.type || !newMaterial.unit) {
        toast.error('Por favor completa todos los campos requeridos');
        return;
      }

      const { error } = await supabase
        .from('raw_materials')
        .insert(newMaterial);

      if (error) throw error;

      toast.success('Material agregado correctamente');
      setShowAddMaterialModal(false);
      setNewMaterial({
        name: '',
        type: 'malt',
        unit: 'kg',
        stock_quantity: 0,
        min_stock: 0
      });
      fetchData();
    } catch (error) {
      console.error('Error adding material:', error);
      toast.error('Error al agregar el material');
    }
  };

  const handleUpdateMaterialStock = async (materialId: string, newQuantity: number) => {
    try {
      const { error } = await supabase
        .from('raw_materials')
        .update({ stock_quantity: newQuantity })
        .eq('id', materialId);

      if (error) throw error;

      toast.success('Stock actualizado correctamente');
      fetchData();
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Error al actualizar el stock');
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#E5E1E6]">Gestión de Producción</h2>
      </div>

      <Tabs defaultValue="materials" className="space-y-4">
        <TabsList>
          <TabsTrigger value="materials">Materias Primas</TabsTrigger>
          <TabsTrigger value="recipes">Recetas</TabsTrigger>
          <TabsTrigger value="batches">Lotes</TabsTrigger>
        </TabsList>

        <TabsContent value="materials">
          <div className="bg-[#2A2A2B] p-6 rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#E5E1E6]">Materias Primas</h3>
              <button
                onClick={() => setShowAddMaterialModal(true)}
                className="px-4 py-2 bg-[#B3A269] text-[#222223] rounded-lg hover:bg-[#B3A269]/90 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Agregar Material
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-[#B3A269]/20">
                    <th className="py-3 text-[#B3A269]">Material</th>
                    <th className="py-3 text-[#B3A269]">Tipo</th>
                    <th className="py-3 text-[#B3A269]">Stock</th>
                    <th className="py-3 text-[#B3A269]">Stock Mínimo</th>
                    <th className="py-3 text-[#B3A269]">Estado</th>
                    <th className="py-3 text-[#B3A269]">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map(material => (
                    <tr key={material.id} className="border-b border-[#B3A269]/10">
                      <td className="py-3 text-[#E5E1E6]">{material.name}</td>
                      <td className="py-3 text-[#E5E1E6]">{material.type}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={material.stock_quantity}
                            onChange={(e) => handleUpdateMaterialStock(material.id, Number(e.target.value))}
                            className="w-24 bg-[#222223] text-[#E5E1E6] p-1 rounded border border-[#B3A269]/20"
                          />
                          <span className="text-[#E5E1E6]">{material.unit}</span>
                        </div>
                      </td>
                      <td className="py-3 text-[#E5E1E6]">
                        {material.min_stock} {material.unit}
                      </td>
                      <td className="py-3">
                        {material.stock_quantity <= material.min_stock ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            Stock Bajo
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Stock OK
                          </span>
                        )}
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => {/* Editar material */}}
                          className="text-[#B3A269] hover:text-[#B3A269]/80 transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Add Material Modal */}
        {showAddMaterialModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#2A2A2B] rounded-lg max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-[#E5E1E6] mb-6">Agregar Material</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#E5E1E6] mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={newMaterial.name}
                    onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                    className="w-full bg-[#222223] text-[#E5E1E6] p-2 rounded border border-[#B3A269]/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#E5E1E6] mb-1">
                    Tipo
                  </label>
                  <select
                    value={newMaterial.type}
                    onChange={(e) => setNewMaterial({ ...newMaterial, type: e.target.value })}
                    className="w-full bg-[#222223] text-[#E5E1E6] p-2 rounded border border-[#B3A269]/20"
                  >
                    <option value="malt">Malta</option>
                    <option value="hops">Lúpulo</option>
                    <option value="yeast">Levadura</option>
                    <option value="adjunct">Adjunto</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#E5E1E6] mb-1">
                    Unidad
                  </label>
                  <select
                    value={newMaterial.unit}
                    onChange={(e) => setNewMaterial({ ...newMaterial, unit: e.target.value })}
                    className="w-full bg-[#222223] text-[#E5E1E6] p-2 rounded border border-[#B3A269]/20"
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="unit">unidad</option>
                    <option value="l">l</option>
                    <option value="ml">ml</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#E5E1E6] mb-1">
                    Stock Inicial
                  </label>
                  <input
                    type="number"
                    value={newMaterial.stock_quantity}
                    onChange={(e) => setNewMaterial({ ...newMaterial, stock_quantity: Number(e.target.value) })}
                    className="w-full bg-[#222223] text-[#E5E1E6] p-2 rounded border border-[#B3A269]/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#E5E1E6] mb-1">
                    Stock Mínimo
                  </label>
                  <input
                    type="number"
                    value={newMaterial.min_stock}
                    onChange={(e) => setNewMaterial({ ...newMaterial, min_stock: Number(e.target.value) })}
                    className="w-full bg-[#222223] text-[#E5E1E6] p-2 rounded border border-[#B3A269]/20"
                  />
                </div>

                <div className="flex justify-end gap-4 mt-8">
                  <button
                    onClick={() => setShowAddMaterialModal(false)}
                    className="px-4 py-2 text-[#E5E1E6] hover:text-[#B3A269] transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddMaterial}
                    className="px-4 py-2 bg-[#B3A269] text-[#222223] rounded-lg hover:bg-[#B3A269]/90 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Guardar Material
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Tabs>
    </div>
  );
};

export default ProductionManagement;