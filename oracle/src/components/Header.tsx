import React from 'react';
import { Link } from 'react-router-dom';
import { Film, BarChart2, LogIn, Database } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Film size={32} />
            <span className="text-xl font-bold">FML Oracle</span>
          </Link>
          <nav>
            <ul className="flex items-center space-x-6">
              <li>
                <Link 
                  to="/oracle" 
                  className="flex items-center space-x-1 hover:text-blue-200 transition duration-300"
                >
                  <Database size={18} />
                  <span>Oracle</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/dashboard" 
                  className="flex items-center space-x-1 hover:text-blue-200 transition duration-300"
                >
                  <BarChart2 size={18} />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/login" 
                  className="bg-white text-blue-600 px-4 py-2 rounded-full hover:bg-blue-100 transition duration-300 flex items-center space-x-1"
                >
                  <LogIn size={18} />
                  <span>Login</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;