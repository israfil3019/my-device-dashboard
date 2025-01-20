'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // If AuthContext is used

const Navbar: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('token');
    logout && logout();
    router.push('/login');
  };

  return (
    <nav className="py-4 bg-gray-800 text-white fixed top-0 left-0 right-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <h1 className="pl-4 text-xl font-bold">Device Dashboard</h1>
        <div className="flex items-center gap-4">
          {user && (
            <p>
              Logged in as: <strong>{user.name}</strong>
            </p>
          )}
          <button
            onClick={handleLogout}
            className="px-4 py-2 mr-4 bg-red-600 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
