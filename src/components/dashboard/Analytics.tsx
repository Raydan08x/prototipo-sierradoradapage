import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import FinancialMetrics from './analytics/FinancialMetrics';
import ProductionMetrics from './analytics/ProductionMetrics';
import SalesMetrics from './analytics/SalesMetrics';
import CustomerMetrics from './analytics/CustomerMetrics';

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#E5E1E6]">Analytics & KPIs</h2>
      </div>

      <Tabs defaultValue="financial" className="space-y-4">
        <TabsList>
          <TabsTrigger value="financial">Financiero</TabsTrigger>
          <TabsTrigger value="production">Producción</TabsTrigger>
          <TabsTrigger value="sales">Ventas</TabsTrigger>
          <TabsTrigger value="customers">Clientes</TabsTrigger>
        </TabsList>

        <TabsContent value="financial">
          <FinancialMetrics />
        </TabsContent>

        <TabsContent value="production">
          <ProductionMetrics />
        </TabsContent>

        <TabsContent value="sales">
          <SalesMetrics />
        </TabsContent>

        <TabsContent value="customers">
          <CustomerMetrics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;