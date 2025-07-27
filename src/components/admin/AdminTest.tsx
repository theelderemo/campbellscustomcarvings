'use client';

import { useState } from 'react';
import { checkAdminRole } from '@/lib/actions';

export default function AdminTest() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const testAdminRole = async () => {
    setLoading(true);
    try {
      const adminStatus = await checkAdminRole();
      setIsAdmin(adminStatus);
    } catch (error) {
      console.error('Error checking admin role:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Admin Role Test</h3>
      <button
        onClick={testAdminRole}
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Checking...' : 'Test Admin Role'}
      </button>
      
      {isAdmin !== null && (
        <div className={`mt-4 p-3 rounded-md ${
          isAdmin ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isAdmin ? '✅ Admin access confirmed' : '❌ Admin access denied'}
        </div>
      )}
    </div>
  );
}
