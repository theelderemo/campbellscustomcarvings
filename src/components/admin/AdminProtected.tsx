'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { checkAdminRole } from '@/lib/actions';

interface AdminProtectedProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function AdminProtected({ children, fallback }: AdminProtectedProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsAuthenticated(false);
          setIsAdmin(false);
          router.push('/admin/login');
          return;
        }

        setIsAuthenticated(true);
        
        const adminCheck = await checkAdminRole();
        setIsAdmin(adminCheck);
        
        if (!adminCheck) {
          router.push('/admin/login?error=unauthorized');
          return;
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setIsAuthenticated(false);
        setIsAdmin(false);
        router.push('/admin/login');
      } else if (session?.user) {
        setIsAuthenticated(true);
        const adminCheck = await checkAdminRole();
        setIsAdmin(adminCheck);
        
        if (!adminCheck) {
          router.push('/admin/login?error=unauthorized');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (loading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      )
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">You need admin privileges to access this area.</p>
          <button
            onClick={() => router.push('/admin/login')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
