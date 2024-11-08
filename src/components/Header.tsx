import React from 'react';
import { Link } from 'react-router-dom';
import { Film, LogOut, Wallet, Trophy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { account, isAdmin, disconnect, points } = useAuth();

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  const formatAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Film size={32} />
            <span className="text-xl font-bold">Fantasy Movie League</span>
          </Link>
          <nav>
            <ul className="flex space-x-4 items-center">
              {account ? (
                <>
                  <li><Link to="/marketplace" className="hover:text-blue-200">Marketplace</Link></li>
                  <li><Link to="/dashboard" className="hover:text-blue-200">Dashboard</Link></li>
                  <li><Link to="/competition" className="hover:text-blue-200 flex items-center">
                    <Trophy size={18} className="mr-1" />
                    Competitions
                  </Link></li>
                  <li><Link to="/leaderboard" className="hover:text-blue-200">Leaderboard</Link></li>
                  <li><Link to="/oracle" className="hover:text-blue-200">Oracle</Link></li>
                  {isAdmin && (
                    <li>
                      <Link 
                        to="/admin/events" 
                        className="bg-yellow-500 text-white px-4 py-2 rounded-full hover:bg-yellow-600 transition-colors font-semibold"
                      >
                        Admin Panel
                      </Link>
                    </li>
                  )}
                  <li>
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-700 px-4 py-2 rounded-full flex items-center">
                        <Wallet size={16} className="mr-2" />
                        <span className="font-mono">{formatAddress(account)}</span>
                        <span className="ml-2 px-2 py-0.5 bg-blue-800 rounded-full text-sm">
                          {points} pts
                        </span>
                      </div>
                      <button
                        onClick={handleDisconnect}
                        className="bg-white text-blue-600 px-4 py-2 rounded-full hover:bg-blue-100 flex items-center transition-colors"
                      >
                        <LogOut size={18} className="mr-2" />
                        Disconnect
                      </button>
                    </div>
                  </li>
                </>
              ) : (
                <li>
                  <Link to="/login" className="bg-white text-blue-600 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors">
                    Connect Wallet
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;