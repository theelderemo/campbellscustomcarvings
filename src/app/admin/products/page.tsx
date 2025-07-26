'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Product } from '@/lib/types';
import ProductForm from '@/components/admin/ProductForm';
import ProductsTable from '@/components/admin/ProductsTable';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      
      await fetchProducts(); // Refresh the list
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
    fetchProducts(); // Refresh the list
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading products...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="mt-2 text-gray-600">
            Manage your product catalog, add new items, and edit existing ones.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleCreateProduct}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Add Product
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mb-8">
          <ProductForm
            product={editingProduct}
            onClose={handleFormClose}
          />
        </div>
      )}

      <div className="bg-white shadow rounded-lg">
        <ProductsTable
          products={products}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      </div>
    </div>
  );
}
