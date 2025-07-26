'use client';

import React from 'react';
import { Product } from '@/lib/types';

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

export default function ProductsTable({ products, onEdit, onDelete }: ProductsTableProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">
          <div className="text-4xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900">No products yet</h3>
          <p className="mt-2 text-sm text-gray-500">
            Get started by adding your first product.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Product
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Material
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {product.images && product.images.length > 0 ? (
                    <img
                      className="h-12 w-12 rounded-lg object-cover mr-4"
                      src={product.images[0]}
                      alt={product.name}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center mr-4">
                      <span className="text-gray-500 text-xs">No Image</span>
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {product.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {product.id.slice(0, 8)}...
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 max-w-xs truncate">
                  {product.description || 'No description'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  ${product.price.toFixed(2)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {product.material || 'N/A'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(product.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
