import React from 'react';
import { PerformerCard } from '../../types/card';
import MarketplaceCard from './MarketplaceCard';

interface CardGridProps {
  cards: PerformerCard[];
  onPurchase: (cardId: string) => void;
  purchasingId: string | null;
  userPoints: number;
}

const CardGrid: React.FC<CardGridProps> = ({
  cards,
  onPurchase,
  purchasingId,
  userPoints
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {cards.map((card) => (
        <MarketplaceCard
          key={card.id}
          card={card}
          onPurchase={onPurchase}
          isPurchasing={purchasingId === card.id}
          canAfford={userPoints >= card.price}
        />
      ))}
    </div>
  );
};

export default CardGrid;