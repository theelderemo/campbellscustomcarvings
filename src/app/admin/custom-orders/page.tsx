'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { CustomOrder } from '@/lib/types';
import CustomOrdersTable from '@/components/admin/CustomOrdersTable';

export default function CustomOrdersPage() {
  const [customOrders, setCustomOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('custom_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomOrders(data || []);
    } catch (error) {
      console.error('Error fetching custom orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomOrders();
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('custom_orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      
      await fetchCustomOrders(); // Refresh the list
    } catch (error) {
      console.error('Error updating custom order status:', error);
      alert('Error updating custom order status');
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this custom order?')) return;

    try {
      const { error } = await supabase
        .from('custom_orders')
        .delete()
        .eq('id', orderId);

      if (error) throw error;
      
      await fetchCustomOrders(); // Refresh the list
    } catch (error) {
      console.error('Error deleting custom order:', error);
      alert('Error deleting custom order');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading custom orders...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Custom Orders</h1>
        <p className="mt-2 text-gray-600">
          Manage custom carving requests from customers. Update status and track progress.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <CustomOrdersTable
          customOrders={customOrders}
          onStatusUpdate={handleStatusUpdate}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
