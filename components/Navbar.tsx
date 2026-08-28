'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { Compass, User, LogOut, CalendarCheck } from 'lucide-react';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <Compass className="h-8 w-8 text-blue-600" />
            <span className="font-bold text-xl text-gray-900">TravelGo</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 font-medium text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition">Home</Link>
            <Link href="/tours" className="hover:text-blue-600 transition">Tours</Link>
            {user && (
              <Link href="/my-bookings" className="hover:text-blue-600 transition flex items-center gap-1">
                <CalendarCheck className="h-4 w-4" /> My Bookings
              </Link>
            )}
            {isAdmin && (
              <Link href="/admin" className="text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-md">
                Admin Dashboard
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 hidden sm:inline">{user.email}</span>
                <button
                  onClick={() => logout()}
                  title="Logout"
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}