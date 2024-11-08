import { collection, query, where, getDocs, doc, getDoc, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import { FantasyEvent } from '../types/event';

export const getActiveEvents = async (): Promise<FantasyEvent[]> => {
  try {
    const eventsRef = collection(db, 'events');
    const q = query(
      eventsRef,
      where('status', '==', 'active'),
      orderBy('startDate', 'desc'),
      limit(10)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FantasyEvent[];
  } catch (error) {
    console.error('Error fetching active events:', error);
    return [];
  }
};

export const getUpcomingEvents = async (): Promise<FantasyEvent[]> => {
  try {
    const eventsRef = collection(db, 'events');
    const q = query(
      eventsRef,
      where('status', '==', 'upcoming'),
      orderBy('startDate', 'asc'),
      limit(10)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FantasyEvent[];
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return [];
  }
};

export const getEventById = async (eventId: string): Promise<FantasyEvent | null> => {
  try {
    const eventRef = doc(db, 'events', eventId);
    const eventDoc = await getDoc(eventRef);

    if (!eventDoc.exists()) {
      return null;
    }

    return {
      id: eventDoc.id,
      ...eventDoc.data()
    } as FantasyEvent;
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
};

export const getEventsByType = async (type: string): Promise<FantasyEvent[]> => {
  try {
    const eventsRef = collection(db, 'events');
    const q = query(
      eventsRef,
      where('type', '==', type),
      where('status', 'in', ['upcoming', 'active']),
      orderBy('startDate', 'asc'),
      limit(10)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FantasyEvent[];
  } catch (error) {
    console.error('Error fetching events by type:', error);
    return [];
  }
};