"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold tracking-tight">
          <Link href="/">
            <span className="hover:text-blue-400 transition-colors">Dan&apos;s Shop</span>
          </Link>
        </div>
        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8 text-lg">
          <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
          <Link href="/shop" className="hover:text-blue-400 transition-colors">Shop</Link>
          <Link href="/custom-order" className="hover:text-blue-400 transition-colors">Custom Order</Link>
        </div>
        {/* Mobile Menu Button (optional, for future expansion) */}
        <div className="md:hidden">
          {/* Add mobile menu button here if needed */}
        </div>
      </div>
    </nav>
  );
}
