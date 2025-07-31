"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import the router
import { supabase } from "@/lib/supabase/client";
import { getUserProfile } from "@/lib/actions";
import AuthModal from "./AuthModal";
import type { User } from "@supabase/supabase-js";
import { UserProfile } from "@/lib/types";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const profile = await getUserProfile(user.id);
        setUserProfile(profile);
      }
      
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const profile = await getUserProfile(session.user.id);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserProfile(null);
    router.push('/'); // Add this line to redirect to the homepage
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <nav className="bg-gray-900 text-white px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="https://mwczjsxnarjgrgozxcxi.supabase.co/storage/v1/object/public/product-images//logo.png"
              alt="Dan's Shop Logo"
              width={40}
              height={40}
            />
            <span className="text-2xl font-bold tracking-tight hover:text-blue-400 transition-colors">
              Dan&apos;s Shop
            </span>
          </Link>
        </div>
        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8 text-lg">
          <Link href="/" className="hover:text-blue-400 transition-colors">
            Home
          </Link>
          <Link href="/shop" className="hover:text-blue-400 transition-colors">
            Shop
          </Link>
          <Link
            href="/custom-order"
            className="hover:text-blue-400 transition-colors"
          >
            Custom Order
          </Link>
          
          {/* Auth Section */}
          {loading ? (
            <div className="animate-pulse bg-gray-700 h-8 w-20 rounded"></div>
          ) : user ? (
            <div className="flex items-center space-x-4">
              {/* Account/Admin Link */}
              {userProfile?.role === 'admin' ? (
                <Link
                  href="/admin"
                  className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm font-medium"
                >
                  Admin
                </Link>
              ) : (
                <Link
                  href="/account"
                  className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  My Account
                </Link>
              )}
              
              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-sm hover:text-blue-400 transition-colors"
                >
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.email?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              Sign In
            </button>
          )}
        </div>
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
              ></path>
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 space-y-2">
          <Link href="/" className="block py-2 px-4 text-sm hover:bg-gray-700 rounded">
            Home
          </Link>
          <Link href="/shop" className="block py-2 px-4 text-sm hover:bg-gray-700 rounded">
            Shop
          </Link>
          <Link href="/custom-order" className="block py-2 px-4 text-sm hover:bg-gray-700 rounded">
            Custom Order
          </Link>
          
          {/* Mobile Auth Section */}
          {user ? (
            <div className="border-t border-gray-700 pt-2 mt-2">
              <div className="px-4 py-2 text-sm text-gray-300">
                {user.email}
              </div>
              {userProfile?.role === 'admin' ? (
                <Link
                  href="/admin"
                  className="block py-2 px-4 text-sm bg-purple-600 text-white rounded mx-2 mb-2 text-center hover:bg-purple-700"
                >
                  Admin Dashboard
                </Link>
              ) : (
                <Link
                  href="/account"
                  className="block py-2 px-4 text-sm bg-indigo-600 text-white rounded mx-2 mb-2 text-center hover:bg-indigo-700"
                >
                  My Account
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="block w-full py-2 px-4 text-sm text-left hover:bg-gray-700 rounded text-red-400"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="border-t border-gray-700 pt-2 mt-2">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="block w-full py-2 px-4 text-sm bg-indigo-600 text-white rounded mx-2 text-center hover:bg-indigo-700"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </nav>
  );
}
