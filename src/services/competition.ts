import { collection, doc, getDoc, setDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { PerformerCard } from '../types/card';
import { getUserCards } from './cards';

interface CompetitionTeam {
  userId: string;
  competitionId: string;
  team: {
    [position: string]: string[];
  };
  points: number;
  rank?: number;
  createdAt: string;
  updatedAt: string;
}

export const submitCompetitionTeam = async (
  userId: string,
  competitionId: string,
  team: { [position: string]: string[] }
): Promise<void> => {
  try {
    // Validate user owns all selected cards
    const userCards = await getUserCards(userId);
    const userCardIds = new Set(userCards.map(card => card.id));
    
    const allSelectedCards = Object.values(team).flat();
    const invalidCards = allSelectedCards.filter(cardId => !userCardIds.has(cardId));
    
    if (invalidCards.length > 0) {
      throw new Error('Invalid team selection: You don\'t own all selected cards');
    }

    // Create or update team
    const teamRef = doc(db, 'competitionTeams', `${competitionId}-${userId}`);
    const competitionTeam: CompetitionTeam = {
      userId,
      competitionId,
      team,
      points: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await setDoc(teamRef, competitionTeam);
  } catch (error) {
    console.error('Error submitting competition team:', error);
    throw error;
  }
};

export const getUserCompetitions = async (userId: string) => {
  try {
    const teamsRef = collection(db, 'competitionTeams');
    const q = query(teamsRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);

    const teams = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Fetch competition details for each team
    const competitionsWithTeams = await Promise.all(
      teams.map(async (team) => {
        const competitionRef = doc(db, 'competitions', team.competitionId);
        const competitionDoc = await getDoc(competitionRef);
        
        if (!competitionDoc.exists()) {
          return null;
        }

        return {
          ...competitionDoc.data(),
          id: competitionDoc.id,
          team: team.team,
          teamPoints: team.points
        };
      })
    );

    return competitionsWithTeams.filter(Boolean);
  } catch (error) {
    console.error('Error fetching user competitions:', error);
    throw error;
  }
};

export const getTeamPoints = async (userId: string, competitionId: string): Promise<number> => {
  try {
    const teamRef = doc(db, 'competitionTeams', `${competitionId}-${userId}`);
    const teamDoc = await getDoc(teamRef);
    
    if (!teamDoc.exists()) {
      return 0;
    }

    return teamDoc.data().points || 0;
  } catch (error) {
    console.error('Error getting team points:', error);
    throw error;
  }
};