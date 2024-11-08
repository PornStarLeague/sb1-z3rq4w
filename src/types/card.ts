export interface PerformerCard {
  id: string;
  name: string;
  image: string;
  price: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  available: boolean;
  ownerId?: string;
  attributes: {
    positions: string[];
    stats: {
      [key: string]: number;
    };
    traits: string[];
  };
  createdAt: string;
  purchasedAt?: string;
}