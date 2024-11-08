import React from 'react';
import { User, ExternalLink } from 'lucide-react';
import { PerformerCard } from '../../types/card';
import { Link } from 'react-router-dom';

interface CardItemProps {
  card: PerformerCard;
  onPurchase: (cardId: string) => void;
  purchasing: boolean;
}

const CardItem: React.FC<CardItemProps> = ({ card, onPurchase, purchasing }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = 'https://via.placeholder.com/300?text=Image+Not+Available';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
      <div className="aspect-square overflow-hidden">
        <img
          src={card.image}
          alt={card.name}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={handleImageError}
        />
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold mb-2">{card.name}</h3>
        
        <div className="space-y-2 text-sm text-gray-600 flex-grow">
          <div className="flex flex-wrap gap-1">
            {card.attributes.positions.map((position, index) => (
              <span
                key={`${card.id}-${position}-${index}`}
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
          
          <div className="flex space-x-2">
            <Link
              to={`/performer/${card.performerId}`}
              className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition-colors flex items-center"
            >
              <User size={16} className="mr-1" />
              Profile
            </Link>
            
            <button
              onClick={() => onPurchase(card.id)}
              disabled={purchasing}
              className="px-3 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {purchasing ? 'Buying...' : 'Buy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardItem;