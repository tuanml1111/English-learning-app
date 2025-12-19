import React from 'react';
import { MdNotifications, MdAccountCircle } from 'react-icons/md';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Page title or breadcrumb */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Welcome back!</h2>
      </div>

      {/* Right side - notifications and user */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <MdNotifications className="text-2xl" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User menu */}
        <div className="relative group">
          <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MdAccountCircle className="text-3xl text-gray-600" />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-800">
                {user?.username || 'User'}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </button>

          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            <button
              onClick={logout}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
