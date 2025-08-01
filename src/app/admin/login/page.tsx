'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { signInUser, signUpUser } from '@/lib/actions';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'unauthorized') {
      setError('You do not have admin privileges to access this area.');
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signInUser(email, password);

      if (!result.success) {
        setError(result.error || 'Login failed');
        setLoading(false);
        return;
      }

      if (!result.isAdmin) {
        setError('You do not have admin privileges to access this area.');
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      router.push('/admin');
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signUpUser(email, password, firstName, lastName, phone, 'admin');

      if (!result.success) {
        setError(result.error || 'Registration failed');
        setLoading(false);
        return;
      }

      setError('');
      alert('Admin account created successfully! Please sign in.');
      setIsRegistering(false);
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isRegistering ? 'Create Admin Account' : 'Admin Login'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isRegistering
              ? 'Create a new admin account to manage the store'
              : 'Sign in to access the admin dashboard'
            }
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={isRegistering ? handleRegister : handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            {isRegistering && (
              <>
                <div>
                  <label htmlFor="firstName" className="sr-only">First Name</label>
                  <input
                    id="firstName" name="firstName" type="text" required
                    className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-none rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="sr-only">Last Name</label>
                  <input
                    id="lastName" name="lastName" type="text" required
                    className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="sr-only">Phone</label>
                  <input
                    id="phone" name="phone" type="tel"
                    className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </>
            )}
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email" name="email" type="email" autoComplete="email" required
                className={`relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ${isRegistering ? '' : 'rounded-t-md'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password" name="password" type="password" autoComplete="current-password" required
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? (isRegistering ? 'Creating account...' : 'Signing in...')
                : (isRegistering ? 'Create Admin Account' : 'Sign in')
              }
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
              }}
              className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
            >
              {isRegistering
                ? 'Already have an account? Sign in'
                : 'Need to create an admin account? Register'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
