import React from 'react';
import { Link } from 'react-router-dom';
import { PerformerCard } from '../../types/card';

interface MarketplaceCardProps {
  card: PerformerCard;
  onPurchase: (cardId: string) => void;
  isPurchasing: boolean;
  canAfford: boolean;
}

const MarketplaceCard: React.FC<MarketplaceCardProps> = ({
  card,
  onPurchase,
  isPurchasing,
  canAfford
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
      <div className="aspect-square overflow-hidden">
        <img
          src={card.image}
          alt={card.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/300?text=Image+Not+Available';
          }}
        />
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold mb-2">{card.name}</h3>
        
        <div className="space-y-2 text-sm text-gray-600 flex-grow">
          <div className="flex flex-wrap gap-1">
            {card.attributes.positions.map((position) => (
              <span
                key={`${card.id}-${position}`}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
              >
                {position}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <span className="text-lg font-bold text-blue-600">
            {card.price} points
          </span>
          
          <div className="flex gap-2">
            <Link 
              to={`/performer/${card.performerId}`}
              className="px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
            >
              View
            </Link>
            <button
              onClick={() => onPurchase(card.id)}
              disabled={isPurchasing || !canAfford}
              className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPurchasing ? 'Buying...' : 
               !canAfford ? 'Not enough points' : 'Buy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceCard;