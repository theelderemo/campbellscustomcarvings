'use client';

import React from 'react';
import { Order } from '@/lib/types';

interface OrdersTableProps {
  orders: Order[];
  onStatusUpdate: (orderId: string, newStatus: string) => void;
}

export default function OrdersTable({ orders, onStatusUpdate }: OrdersTableProps) {
  const statusOptions = ['pending', 'processing', 'completed', 'cancelled'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
          <p className="mt-2 text-sm text-gray-500">
            Orders will appear here once customers start purchasing.
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
              Product
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
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
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {order.product?.name || 'Unknown Product'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {order.quantity}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  ${order.total_amount.toFixed(2)}
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
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(order.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {order.customer_phone && (
                    <div>📞 {order.customer_phone}</div>
                  )}
                </div>
                {order.notes && (
                  <div className="text-xs text-gray-500 mt-1">
                    Note: {order.notes}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
