'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { getUserProfile } from '@/lib/actions';
import { UserProfile, Order, CustomOrder } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js'; // Import the User type

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null); // Correctly type the user state
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customOrders, setCustomOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/');
        return;
      }

      setUser(user);

      // Get user profile
      const profile = await getUserProfile(user.id);
      setUserProfile(profile);

      // Fetch user's orders
      const { data: userOrders } = await supabase
        .from('orders')
        .select(`
          *,
          products (
            id,
            name,
            price
          )
        `)
        .eq('customer_email', user.email)
        .order('created_at', { ascending: false });

      // Fetch user's custom orders
      const { data: userCustomOrders } = await supabase
        .from('custom_orders')
        .select('*')
        .eq('customer_email', user.email)
        .order('created_at', { ascending: false });

      setOrders(userOrders || []);
      setCustomOrders(userCustomOrders || []);
      setLoading(false);
    };

    getUser();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
              <p className="mt-2 text-gray-600">Welcome back, {user?.email}</p>
              {userProfile && (
                <div className="mt-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    userProfile.role === 'admin'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {userProfile.role}
                  </span>
                </div>
              )}
            </div>
            <div className="flex space-x-4">
              {userProfile?.role === 'admin' && (
                <button
                  onClick={() => router.push('/admin')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Admin Dashboard
                </button>
              )}
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Regular Orders */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">My Orders</h2>
            {orders.length === 0 ? (
              <p className="text-gray-500">No orders yet.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {order.product?.name || 'Product'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Quantity: {order.quantity}
                        </p>
                        <p className="text-sm text-gray-600">
                          Total: ${order.total_amount}
                        </p>
                        <p className="text-sm text-gray-500">
                          Ordered: {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'processing'
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    {order.notes && (
                      <p className="mt-2 text-sm text-gray-600">
                        Notes: {order.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Custom Orders */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Custom Order Requests</h2>
            {customOrders.length === 0 ? (
              <p className="text-gray-500">No custom orders yet.</p>
            ) : (
              <div className="space-y-4">
                {customOrders.map((customOrder) => (
                  <div key={customOrder.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">Custom Request</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {customOrder.description}
                        </p>
                        {customOrder.budget && (
                          <p className="text-sm text-gray-600">
                            Budget: ${customOrder.budget}
                          </p>
                        )}
                        <p className="text-sm text-gray-500">
                          Requested: {new Date(customOrder.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        customOrder.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : customOrder.status === 'in_progress'
                          ? 'bg-yellow-100 text-yellow-800'
                          : customOrder.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {customOrder.status.replace('_', ' ')}
                      </span>
                    </div>
                    {customOrder.notes && (
                      <p className="mt-2 text-sm text-gray-600">
                        Notes: {customOrder.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => router.push('/shop')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Browse Products
            </button>
            <button
              onClick={() => router.push('/custom-order')}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Request Custom Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
