"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react"; // Added React import

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        <div className="hidden md:flex space-x-8 text-lg">
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
        <div className="md:hidden mt-4">
          <Link href="/" className="block py-2 px-4 text-sm hover:bg-gray-700 rounded">
            Home
          </Link>
          <Link href="/shop" className="block py-2 px-4 text-sm hover:bg-gray-700 rounded">
            Shop
          </Link>
          <Link href="/custom-order" className="block py-2 px-4 text-sm hover:bg-gray-700 rounded">
            Custom Order
          </Link>
        </div>
      )}
    </nav>
  );
}
