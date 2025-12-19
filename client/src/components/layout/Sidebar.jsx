import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  MdDashboard,
  MdStyle,
  MdMenuBook,
  MdQuiz,
  MdHelp,
  MdSettings,
} from 'react-icons/md';

const Sidebar = () => {
  const menuItems = [
    { path: '/dashboard', icon: MdDashboard, label: 'Dashboard' },
    { path: '/flashcards', icon: MdStyle, label: 'Flash card' },
    { path: '/grammar', icon: MdMenuBook, label: 'Grammar' },
    { path: '/quiz', icon: MdQuiz, label: 'Quiz' },
    { path: '/settings', icon: MdSettings, label: 'Setting' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-primary">BrainHub</h1>
      </div>

      {/* Menu items */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Icon className="text-xl" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Get Help button at bottom */}
      <div className="px-4 pb-6">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <MdHelp className="text-xl" />
          <span className="font-medium">Get Help</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
