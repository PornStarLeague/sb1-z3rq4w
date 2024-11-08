import { ethers } from 'ethers';
import { NFT } from '../types/nft';
import { CONTRACTS } from '../config/contracts';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

// Sample image URLs for different rarity levels (using Unsplash for demo)
const RARITY_IMAGES = {
  Common: [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
    'https://images.unsplash.com/photo-1642104704074-907c0698b98d'
  ],
  Rare: [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
    'https://images.unsplash.com/photo-1642104704074-907c0698b98d'
  ],
  Epic: [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
    'https://images.unsplash.com/photo-1642104704074-907c0698b98d'
  ],
  Legendary: [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
    'https://images.unsplash.com/photo-1642104704074-907c0698b98d'
  ]
};

// Get a random image URL for a given rarity
const getRandomImage = (rarity: keyof typeof RARITY_IMAGES): string => {
  const images = RARITY_IMAGES[rarity];
  return images[Math.floor(Math.random() * images.length)];
};

export const getNFTsByOwner = async (ownerAddress: string): Promise<NFT[]> => {
  try {
    if (!ownerAddress) {
      throw new Error('Owner address is required');
    }

    const nftsRef = collection(db, 'nfts');
    const q = query(nftsRef, where('owner', '==', ownerAddress.toLowerCase()));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      tokenId: doc.id,
      ...doc.data()
    })) as NFT[];
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    throw error;
  }
};

export const getAvailableNFTs = async (): Promise<NFT[]> => {
  try {
    const nftsRef = collection(db, 'nfts');
    const q = query(nftsRef, where('available', '==', true));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      tokenId: doc.id,
      ...doc.data()
    })) as NFT[];
  } catch (error) {
    console.error('Error fetching available NFTs:', error);
    throw error;
  }
};