import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { supabase } from '../../lib/supabase';
import { Plus, Truck, Package, AlertTriangle, Check, FileText, X } from 'lucide-react';
import toast from 'react-hot-toast';

// Types
interface PurchaseOrder {
  id: string;
  supplier_id: string;
  order_date: string;
  expected_delivery_date: string;
  status: string;
  total_amount: number;
  notes: string;
}

interface PurchaseOrderItem {
  id: string;
  purchase_order_id: string;
  material_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  received_quantity: number;
}

interface Shipment {
  id: string;
  type: 'inbound' | 'outbound';
  status: string;
  origin: string;
  destination: string;
  carrier: string;
  tracking_number: string;
  expected_date: string;
  actual_date: string | null;
}

interface InventoryTransaction {
  id: string;
  product_id: string;
  type: string;
  quantity: number;
  reference_id: string;
  reference_type: string;
  notes: string;
  created_at: string;
}

const LogisticsManagement = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewPOModal, setShowNewPOModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch purchase orders
      const { data: poData, error: poError } = await supabase
        .from('purchase_orders')
        .select(`
          *,
          supplier:suppliers(name),
          items:purchase_order_items(
            *,
            material:raw_materials(name, unit)
          )
        `)
        .order('created_at', { ascending: false });

      if (poError) throw poError;
      setPurchaseOrders(poData);

      // Fetch shipments
      const { data: shipmentData, error: shipmentError } = await supabase
        .from('shipments')
        .select('*')
        .order('expected_date', { ascending: true });

      if (shipmentError) throw shipmentError;
      setShipments(shipmentData);

      // Fetch recent transactions
      const { data: transactionData, error: transactionError } = await supabase
        .from('inventory_transactions')
        .select(`
          *,
          product:products(name),
          created_by:profiles(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (transactionError) throw transactionError;
      setTransactions(transactionData);

    } catch (error) {
      console.error('Error fetching logistics data:', error);
      toast.error('Error al cargar los datos de logística');
    } finally {
      setLoading(false);
    }
  };

  const createPurchaseOrder = async (data: any) => {
    try {
      const { data: po, error: poError } = await supabase
        .from('purchase_orders')
        .insert({
          supplier_id: data.supplier_id,
          expected_delivery_date: data.expected_delivery_date,
          status: 'draft',
          notes: data.notes
        })
        .select()
        .single();

      if (poError) throw poError;

      // Insert PO items
      const items = data.items.map((item: any) => ({
        purchase_order_id: po.id,
        material_id: item.material_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.quantity * item.unit_price
      }));

      const { error: itemsError } = await supabase
        .from('purchase_order_items')
        .insert(items);

      if (itemsError) throw itemsError;

      toast.success('Orden de compra creada correctamente');
      fetchData();
    } catch (error) {
      console.error('Error creating purchase order:', error);
      toast.error('Error al crear la orden de compra');
    }
  };

  const updateShipmentStatus = async (shipmentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('shipments')
        .update({ status: newStatus })
        .eq('id', shipmentId);

      if (error) throw error;

      toast.success('Estado del envío actualizado');
      fetchData();
    } catch (error) {
      console.error('Error updating shipment:', error);
      toast.error('Error al actualizar el estado del envío');
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#E5E1E6]">Gestión Logística</h2>
      </div>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Inventario</TabsTrigger>
          <TabsTrigger value="purchases">Órdenes de Compra</TabsTrigger>
          <TabsTrigger value="shipments">Envíos</TabsTrigger>
          <TabsTrigger value="transactions">Movimientos</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          <div className="bg-[#2A2A2B] p-6 rounded-lg space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#E5E1E6]">Estado del Inventario</h3>
              <button
                onClick={() => setShowNewPOModal(true)}
                className="px-4 py-2 bg-[#B3A269] text-[#222223] rounded-lg hover:bg-[#B3A269]/90 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Nueva Orden de Compra
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Materias Primas con Stock Bajo */}
              <div className="bg-[#222223] p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                  <h4 className="text-lg font-medium text-[#E5E1E6]">Stock Bajo</h4>
                </div>
                <div className="space-y-3">
                  {/* Lista de materiales con stock bajo */}
                </div>
              </div>

              {/* Órdenes en Camino */}
              <div className="bg-[#222223] p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Truck className="w-6 h-6 text-[#B3A269]" />
                  <h4 className="text-lg font-medium text-[#E5E1E6]">En Camino</h4>
                </div>
                <div className="space-y-3">
                  {/* Lista de órdenes en camino */}
                </div>
              </div>

              {/* Resumen de Inventario */}
              <div className="bg-[#222223] p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Package className="w-6 h-6 text-[#B3A269]" />
                  <h4 className="text-lg font-medium text-[#E5E1E6]">Resumen</h4>
                </div>
                <div className="space-y-3">
                  {/* Resumen de inventario */}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="purchases">
          <div className="bg-[#2A2A2B] p-6 rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#E5E1E6]">Órdenes de Compra</h3>
              <button
                onClick={() => setShowNewPOModal(true)}
                className="px-4 py-2 bg-[#B3A269] text-[#222223] rounded-lg hover:bg-[#B3A269]/90 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Nueva Orden
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-[#B3A269]/20">
                    <th className="py-3 text-[#B3A269]">Número</th>
                    <th className="py-3 text-[#B3A269]">Proveedor</th>
                    <th className="py-3 text-[#B3A269]">Fecha</th>
                    <th className="py-3 text-[#B3A269]">Entrega Est.</th>
                    <th className="py-3 text-[#B3A269]">Estado</th>
                    <th className="py-3 text-[#B3A269]">Total</th>
                    <th className="py-3 text-[#B3A269]">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseOrders.map(po => (
                    <tr key={po.id} className="border-b border-[#B3A269]/10">
                      <td className="py-3 text-[#E5E1E6]">PO-{po.id.slice(0, 8)}</td>
                      <td className="py-3 text-[#E5E1E6]">{po.supplier?.name}</td>
                      <td className="py-3 text-[#E5E1E6]">
                        {new Date(po.order_date).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-[#E5E1E6]">
                        {new Date(po.expected_delivery_date).toLocaleDateString()}
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          po.status === 'received'
                            ? 'bg-green-100 text-green-800'
                            : po.status === 'in_transit'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {po.status === 'received'
                            ? 'Recibido'
                            : po.status === 'in_transit'
                            ? 'En Tránsito'
                            : 'Pendiente'}
                        </span>
                      </td>
                      <td className="py-3 text-[#E5E1E6]">
                        ${po.total_amount.toLocaleString()}
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => {/* Ver detalles */}}
                          className="text-[#B3A269] hover:text-[#B3A269]/80 transition-colors"
                        >
                          <FileText className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="shipments">
          <div className="bg-[#2A2A2B] p-6 rounded-lg">
            <h3 className="text-xl font-bold text-[#E5E1E6] mb-6">Envíos</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-[#B3A269]/20">
                    <th className="py-3 text-[#B3A269]">ID</th>
                    <th className="py-3 text-[#B3A269]">Tipo</th>
                    <th className="py-3 text-[#B3A269]">Origen</th>
                    <th className="py-3 text-[#B3A269]">Destino</th>
                    <th className="py-3 text-[#B3A269]">Fecha Est.</th>
                    <th className="py-3 text-[#B3A269]">Estado</th>
                    <th className="py-3 text-[#B3A269]">Tracking</th>
                  </tr>
                </thead>
                <tbody>
                  {shipments.map(shipment => (
                    <tr key={shipment.id} className="border-b border-[#B3A269]/10">
                      <td className="py-3 text-[#E5E1E6]">
                        {shipment.type === 'inbound' ? 'IN-' : 'OUT-'}{shipment.id.slice(0, 8)}
                      </td>
                      <td className="py-3 text-[#E5E1E6]">
                        {shipment.type === 'inbound' ? 'Entrada' : 'Salida'}
                      </td>
                      <td className="py-3 text-[#E5E1E6]">{shipment.origin}</td>
                      <td className="py-3 text-[#E5E1E6]">{shipment.destination}</td>
                      <td className="py-3 text-[#E5E1E6]">
                        {new Date(shipment.expected_date).toLocaleDateString()}
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          shipment.status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : shipment.status === 'in_transit'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {shipment.status === 'delivered'
                            ? 'Entregado'
                            : shipment.status === 'in_transit'
                            ? 'En Tránsito'
                            : 'Pendiente'}
                        </span>
                      </td>
                      <td className="py-3 text-[#E5E1E6]">
                        {shipment.tracking_number || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <div className="bg-[#2A2A2B] p-6 rounded-lg">
            <h3 className="text-xl font-bold text-[#E5E1E6] mb-6">Movimientos de Inventario</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-[#B3A269]/20">
                    <th className="py-3 text-[#B3A269]">Fecha</th>
                    <th className="py-3 text-[#B3A269]">Tipo</th>
                    <th className="py-3 text-[#B3A269]">Producto</th>
                    <th className="py-3 text-[#B3A269]">Cantidad</th>
                    <th className="py-3 text-[#B3A269]">Usuario</th>
                    <th className="py-3 text-[#B3A269]">Notas</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(transaction => (
                    <tr key={transaction.id} className="border-b border-[#B3A269]/10">
                      <td className="py-3 text-[#E5E1E6]">
                        {new Date(transaction.created_at).toLocaleString()}
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.type === 'production'
                            ? 'bg-blue-100 text-blue-800'
                            : transaction.type === 'sale'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {transaction.type === 'production'
                            ? 'Producción'
                            : transaction.type === 'sale'
                            ? 'Venta'
                            : 'Ajuste'}
                        </span>
                      </td>
                      <td className="py-3 text-[#E5E1E6]">{transaction.product?.name}</td>
                      <td className="py-3 text-[#E5E1E6]">{transaction.quantity}</td>
                      <td className="py-3 text-[#E5E1E6]">{transaction.created_by?.full_name}</td>
                      <td className="py-3 text-[#E5E1E6]">{transaction.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LogisticsManagement;