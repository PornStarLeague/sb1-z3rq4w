import React, { useState, useEffect } from 'react';
import { ShoppingBag, AlertCircle } from 'lucide-react';
import { getAvailableCards, purchaseCard } from '../services/cards';
import { useAuth } from '../context/AuthContext';
import { PerformerCard } from '../types/card';
import CardGrid from '../components/cards/CardGrid';

const NFTMarketplace: React.FC = () => {
  const { account, points } = useAuth();
  const [cards, setCards] = useState<PerformerCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      setLoading(true);
      setError(null);
      const availableCards = await getAvailableCards();
      setCards(availableCards);
    } catch (err) {
      console.error('Error fetching available cards:', err);
      setError('Failed to load available cards');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (cardId: string) => {
    if (!account) {
      setError('Please connect your wallet to purchase cards');
      return;
    }

    try {
      setPurchasing(cardId);
      await purchaseCard(account, cardId);
      await fetchCards(); // Refresh the list
    } catch (err: any) {
      setError(err.message || 'Failed to purchase card');
    } finally {
      setPurchasing(null);
    }
  };

  const handlePriceRangeChange = (range: [number, number]) => {
    setPriceRange(range);
  };

  const filteredCards = cards.filter(card => 
    card.price >= priceRange[0] && card.price <= priceRange[1]
  );

  if (!account) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600">
            Please connect your wallet to view and purchase cards.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Card Marketplace</h1>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 flex items-start">
          <AlertCircle className="text-red-500 mr-3 mt-0.5" size={20} />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range: {priceRange[0]} - {priceRange[1]} points
        </label>
        <input
          type="range"
          min={0}
          max={10000}
          step={100}
          value={priceRange[1]}
          onChange={(e) => handlePriceRangeChange([priceRange[0], parseInt(e.target.value)])}
          className="w-full"
        />
      </div>

      {filteredCards.length > 0 ? (
        <CardGrid
          cards={filteredCards}
          onPurchase={handlePurchase}
          purchasingId={purchasing}
          userPoints={points}
        />
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Cards Available</h2>
          <p className="text-gray-600">
            {cards.length === 0 ? 
              'Check back later for new cards in the marketplace.' :
              'Try adjusting your price range to see more cards.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default NFTMarketplace;