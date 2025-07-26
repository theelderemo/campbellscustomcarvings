'use client';

import React from 'react';
import { CustomOrder } from '@/lib/types';

interface CustomOrdersTableProps {
  customOrders: CustomOrder[];
  onStatusUpdate: (orderId: string, newStatus: string) => void;
  onDelete: (orderId: string) => void;
}

export default function CustomOrdersTable({ 
  customOrders, 
  onStatusUpdate, 
  onDelete 
}: CustomOrdersTableProps) {
  const statusOptions = ['pending', 'in_progress', 'completed', 'cancelled'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (customOrders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">
          <div className="text-4xl mb-4">🎨</div>
          <h3 className="text-lg font-medium text-gray-900">No custom orders yet</h3>
          <p className="mt-2 text-sm text-gray-500">
            Custom order requests will appear here when customers submit them.
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
              Order ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Budget
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Images
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {customOrders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-mono text-gray-900">
                  {order.id.slice(0, 8)}...
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {order.customer_name}
                </div>
                <div className="text-sm text-gray-500">
                  {order.customer_email}
                </div>
                {order.customer_phone && (
                  <div className="text-sm text-gray-500">
                    📞 {order.customer_phone}
                  </div>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 max-w-xs">
                  <div className="truncate">{order.description}</div>
                  {order.notes && (
                    <div className="text-xs text-gray-500 mt-1">
                      Note: {order.notes}
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {order.budget ? `$${order.budget.toFixed(2)}` : 'Not specified'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <select
                  value={order.status}
                  onChange={(e) => onStatusUpdate(order.id, e.target.value)}
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border-0 ${getStatusColor(order.status)}`}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(order.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {order.images && order.images.length > 0 ? (
                  <div className="flex gap-1">
                    {order.images.slice(0, 2).map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Reference ${index + 1}`}
                        className="h-8 w-8 rounded object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ))}
                    {order.images.length > 2 && (
                      <div className="h-8 w-8 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                        +{order.images.length - 2}
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">No images</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      const fullDescription = `
Customer: ${order.customer_name}
Email: ${order.customer_email}
Phone: ${order.customer_phone || 'Not provided'}
Budget: ${order.budget ? `$${order.budget}` : 'Not specified'}

Description:
${order.description}

${order.notes ? `Notes: ${order.notes}` : ''}

${order.images && order.images.length > 0 ? `
Reference Images:
${order.images.join('\n')}` : ''}
                      `;
                      alert(fullDescription);
                    }}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => onDelete(order.id)}
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
