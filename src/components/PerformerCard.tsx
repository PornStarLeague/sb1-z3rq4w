import React from 'react';
import { PerformerCard as PerformerCardType } from '../types/card';
import { useAuth } from '../context/AuthContext';

interface PerformerCardProps {
  card: PerformerCardType;
  onPurchase?: (cardId: string) => void;
}

const PerformerCard: React.FC<PerformerCardProps> = ({ card, onPurchase }) => {
  const { points } = useAuth();
  const canAfford = points >= card.price;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="aspect-square overflow-hidden">
        <img
          src={card.image}
          alt={card.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{card.name}</h3>
        
        <div className="space-y-2 text-sm text-gray-600">
          {card.attributes.birthYear && (
            <p>Birth Year: {card.attributes.birthYear}</p>
          )}
          {card.attributes.height && (
            <p>Height: {card.attributes.height}</p>
          )}
          {card.attributes.measurements && (
            <p>Measurements: {card.attributes.measurements}</p>
          )}
          
          <div className="flex flex-wrap gap-1">
            {card.attributes.positions.map((position, index) => (
              <span
                key={index}
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
          
          {!card.owned && onPurchase && (
            <button
              onClick={() => onPurchase(card.id)}
              disabled={!canAfford}
              className={`px-4 py-2 rounded-full text-white ${
                canAfford 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-gray-400 cursor-not-allowed'
              } transition-colors`}
            >
              {canAfford ? 'Purchase' : 'Not enough points'}
            </button>
          )}
          
          {card.owned && (
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full">
              Owned
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformerCard;