import { doc, getDoc, setDoc, updateDoc, collection, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../config/firebase';

const INITIAL_POINTS = 20000;

export const initializeUserPoints = async (userId: string): Promise<number> => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const userRef = doc(db, 'users', userId.toLowerCase());

  try {
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      await setDoc(userRef, {
        points: INITIAL_POINTS,
        moviesSubmitted: 0,
        scenesSubmitted: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } else if (!userDoc.data().points || userDoc.data().points < INITIAL_POINTS) {
      await updateDoc(userRef, {
        points: INITIAL_POINTS,
        updatedAt: new Date().toISOString()
      });
    }

    return INITIAL_POINTS;
  } catch (error) {
    console.error('Error initializing user points:', error);
    throw new Error('Failed to initialize user points');
  }
};

export const updateAllUsersPoints = async (): Promise<void> => {
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    
    // Create a new batch
    const batch = writeBatch(db);
    let operationCount = 0;
    const MAX_BATCH_SIZE = 500; // Firestore batch limit
    
    for (const userDoc of snapshot.docs) {
      const userData = userDoc.data();
      
      if (!userData.points || userData.points < INITIAL_POINTS) {
        batch.update(userDoc.ref, {
          points: INITIAL_POINTS,
          updatedAt: new Date().toISOString()
        });
        
        operationCount++;
        
        // If we reach the batch limit, commit and start a new batch
        if (operationCount === MAX_BATCH_SIZE) {
          await batch.commit();
          operationCount = 0;
        }
      }
    }
    
    // Commit any remaining operations
    if (operationCount > 0) {
      await batch.commit();
    }
    
    console.log('Successfully updated all users points');
  } catch (error) {
    console.error('Error updating users points:', error);
    throw new Error('Failed to update users points');
  }
};

export const getUserPoints = async (userId: string): Promise<number> => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const userRef = doc(db, 'users', userId.toLowerCase());
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return await initializeUserPoints(userId);
    }

    const points = userDoc.data().points || 0;
    
    // Update points if less than initial amount
    if (points < INITIAL_POINTS) {
      await updateDoc(userRef, {
        points: INITIAL_POINTS,
        updatedAt: new Date().toISOString()
      });
      return INITIAL_POINTS;
    }

    return points;
  } catch (error) {
    console.error('Error getting user points:', error);
    throw new Error('Failed to get user points');
  }
};

export const updateUserPoints = async (userId: string, points: number): Promise<void> => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  if (points < 0) {
    throw new Error('Points cannot be negative');
  }

  try {
    const userRef = doc(db, 'users', userId.toLowerCase());
    await updateDoc(userRef, {
      points,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating user points:', error);
    throw new Error('Failed to update user points');
  }
};