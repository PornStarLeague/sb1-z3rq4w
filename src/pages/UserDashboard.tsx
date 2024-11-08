import React, { useState, useEffect } from 'react';
import { Award, Film, DollarSign, TrendingUp, Video, Search } from 'lucide-react';
import { getUserCards } from '../services/cards';
import { getUserPoints } from '../services/user';
import { useAuth } from '../context/AuthContext';
import { PerformerCard as PerformerCardType } from '../types/card';
import PerformerCard from '../components/PerformerCard';

const UserDashboard: React.FC = () => {
  const { account } = useAuth();
  const [userCards, setUserCards] = useState<PerformerCardType[]>([]);
  const [points, setPoints] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name');

  useEffect(() => {
    if (account) {
      fetchUserData();
    }
  }, [account]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [cards, userPoints] = await Promise.all([
        getUserCards(account!),
        getUserPoints(account!)
      ]);
      setUserCards(cards);
      setPoints(userPoints);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load your data');
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedCards = userCards
    .filter(card => 
      card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.attributes.positions.some(pos => 
        pos.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return a.price - b.price;
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Dashboard</h1>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="flex items-center">
              <DollarSign className="text-blue-600 mr-2" size={24} />
              <div>
                <p className="text-sm text-gray-600">Available Points</p>
                <p className="text-2xl font-bold text-blue-600">{points}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg">
            <div className="flex items-center">
              <Award className="text-purple-600 mr-2" size={24} />
              <div>
                <p className="text-sm text-gray-600">Collection Size</p>
                <p className="text-2xl font-bold text-purple-600">{userCards.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Collection</h2>
          <div className="flex space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search cards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'price')}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
            </select>
          </div>
        </div>

        {filteredAndSortedCards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredAndSortedCards.map((card) => (
              <PerformerCard key={card.id} card={card} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            {searchTerm ? (
              <p className="text-gray-600">
                No cards found matching "{searchTerm}"
              </p>
            ) : (
              <p className="text-gray-600">
                You haven't collected any performer cards yet. Visit the marketplace to start your collection!
              </p>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;