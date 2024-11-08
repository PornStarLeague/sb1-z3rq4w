import React, { useState, useEffect } from 'react';
import { Film, Award, Star, Trophy, Search, Filter } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { PerformerCard as CardType } from '../types/card';
import { getUserCards } from '../services/cards';
import { getUserCompetitions } from '../services/competition';
import CardGrid from '../components/cards/CardGrid';
import CardFilters from '../components/cards/CardFilters';
import CompetitionList from '../components/competitions/CompetitionList';

const Dashboard: React.FC = () => {
  const { account } = useAuth();
  const [activeTab, setActiveTab] = useState<'collection' | 'competitions'>('collection');
  const [ownedCards, setOwnedCards] = useState<CardType[]>([]);
  const [userCompetitions, setUserCompetitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [selectedPosition, setSelectedPosition] = useState('');

  useEffect(() => {
    if (account) {
      fetchUserData();
    }
  }, [account]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [cards, competitions] = await Promise.all([
        getUserCards(account!),
        getUserCompetitions(account!)
      ]);
      setOwnedCards(cards);
      setUserCompetitions(competitions);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load your data');
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const filteredCards = ownedCards.filter(card => {
    const matchesPrice = card.price >= minPrice && card.price <= maxPrice;
    const matchesPosition = !selectedPosition || card.attributes.positions.includes(selectedPosition);
    return matchesPrice && matchesPosition;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Collection Size</p>
                <p className="text-2xl font-bold text-blue-600">{ownedCards.length}</p>
              </div>
              <Film className="text-blue-600" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Competitions</p>
                <p className="text-2xl font-bold text-purple-600">
                  {userCompetitions.filter(c => c.status === 'active').length}
                </p>
              </div>
              <Trophy className="text-purple-600" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Points Earned</p>
                <p className="text-2xl font-bold text-green-600">
                  {userCompetitions.reduce((sum, c) => sum + (c.teamPoints || 0), 0)}
                </p>
              </div>
              <Star className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('collection')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'collection'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Collection
          </button>
          <button
            onClick={() => setActiveTab('competitions')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'competitions'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Competitions
          </button>
        </div>

        {activeTab === 'collection' ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <CardFilters
                minPrice={minPrice}
                maxPrice={maxPrice}
                selectedPosition={selectedPosition}
                onPriceChange={handlePriceChange}
                onPositionChange={setSelectedPosition}
              />
            </div>
            <div className="lg:col-span-3">
              <CardGrid
                cards={filteredCards}
                onPurchase={() => {}}
                purchasingId={null}
                loading={loading}
              />
            </div>
          </div>
        ) : (
          <CompetitionList competitions={userCompetitions} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;