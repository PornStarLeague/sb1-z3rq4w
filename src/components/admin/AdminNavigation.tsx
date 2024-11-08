import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Settings, Calendar, DollarSign } from 'lucide-react';

const AdminNavigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/admin/events', label: 'Events', icon: Calendar },
    { path: '/admin/competitions', label: 'Competitions', icon: Trophy },
    { path: '/admin/points', label: 'Point Values', icon: DollarSign },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bg-white shadow-md rounded-lg mb-8">
      <div className="flex overflow-x-auto">
        {navItems.map(({ path, label, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap ${
              isActive(path)
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600 hover:border-b-2 hover:border-blue-300'
            }`}
          >
            <Icon size={18} className="mr-2" />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default AdminNavigation;