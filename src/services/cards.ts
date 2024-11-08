import { collection, doc, getDoc, getDocs, query, where, updateDoc, increment, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { PerformerCard } from '../types/card';
import { nanoid } from 'nanoid';

export const getAvailableCards = async (): Promise<PerformerCard[]> => {
  try {
    const cardsRef = collection(db, 'cards');
    const q = query(cardsRef, where('available', '==', true));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as PerformerCard[];
  } catch (error) {
    console.error('Error fetching available cards:', error);
    return [];
  }
};

export const getUserCards = async (userId: string): Promise<PerformerCard[]> => {
  try {
    const cardsRef = collection(db, 'cards');
    const q = query(cardsRef, where('ownerId', '==', userId));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as PerformerCard[];
  } catch (error) {
    console.error('Error fetching user cards:', error);
    return [];
  }
};

export const purchaseCard = async (userId: string, cardId: string): Promise<void> => {
  try {
    const cardRef = doc(db, 'cards', cardId);
    const userRef = doc(db, 'users', userId);
    
    const cardDoc = await getDoc(cardRef);
    const userDoc = await getDoc(userRef);
    
    if (!cardDoc.exists() || !userDoc.exists()) {
      throw new Error('Card or user not found');
    }
    
    const card = cardDoc.data() as PerformerCard;
    const userPoints = userDoc.data().points || 0;
    
    if (!card.available) {
      throw new Error('Card is no longer available');
    }
    
    if (userPoints < card.price) {
      throw new Error('Insufficient points');
    }
    
    await updateDoc(cardRef, {
      ownerId: userId,
      available: false,
      purchasedAt: new Date().toISOString()
    });
    
    await updateDoc(userRef, {
      points: increment(-card.price)
    });
  } catch (error) {
    console.error('Error purchasing card:', error);
    throw error;
  }
};