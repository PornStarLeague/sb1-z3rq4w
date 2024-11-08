import { nanoid } from 'nanoid';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { PerformerCard } from '../types/card';

// Professional model images from Unsplash
const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04'
];

const getRandomImage = () => SAMPLE_IMAGES[Math.floor(Math.random() * SAMPLE_IMAGES.length)];

// Price ranges for different rarities
const PRICE_RANGES = {
  Legendary: { min: 2000, max: 2500 },
  Epic: { min: 1200, max: 1800 },
  Rare: { min: 500, max: 1000 }
};

const getRandomPrice = (rarity: string) => {
  const range = PRICE_RANGES[rarity as keyof typeof PRICE_RANGES];
  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
};

// Sample performer data
const SAMPLE_PERFORMERS = [
  { name: "Victoria Vixen", positions: ['Legend', 'MILF', 'Lead'], rarity: 'Legendary' },
  { name: "Luna Legend", positions: ['Legend', 'Cam Girl', 'MILF'], rarity: 'Legendary' },
  { name: "Sophia Storm", positions: ['Analqueen', 'Lead', 'Special'], rarity: 'Epic' },
  { name: "Aria Angel", positions: ['Lead', 'Special', 'Cam Girl'], rarity: 'Rare' },
  { name: "Maya Mystique", positions: ['Analqueen', 'MILF', 'Special'], rarity: 'Epic' }
  // Add more performers as needed to reach 50 total
];

export const createSampleCards = () => {
  // Generate unique IDs for each card
  return SAMPLE_PERFORMERS.map(performer => ({
    id: nanoid(), // Ensures unique ID for each card
    name: performer.name,
    image: getRandomImage(),
    price: getRandomPrice(performer.rarity),
    rarity: performer.rarity,
    available: true,
    attributes: {
      positions: performer.positions,
      stats: {
        power: Math.floor(Math.random() * 50) + 50,
        agility: Math.floor(Math.random() * 50) + 50,
        stamina: Math.floor(Math.random() * 50) + 50
      },
      traits: []
    },
    createdAt: new Date().toISOString()
  }));
};

export const addSampleCardsToMarketplace = async () => {
  try {
    const cardsRef = collection(db, 'cards');
    const sampleCards = createSampleCards();
    
    // Add each card with its unique ID
    for (const card of sampleCards) {
      await addDoc(cardsRef, card);
    }
    
    console.log('Successfully added sample cards to marketplace');
  } catch (error) {
    console.error('Error adding sample cards:', error);
    throw error;
  }
};