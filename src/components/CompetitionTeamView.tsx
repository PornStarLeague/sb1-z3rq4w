import React, { useEffect, useState } from 'react';
import { getUserCards } from '../services/cards';
import { getEventById } from '../services/event';
import { FantasyEvent } from '../types/event';
import { PerformerCard } from '../types/card';

interface CompetitionTeamViewProps {
  competitionId: string;
  userId: string;
}

const CompetitionTeamView: React.FC<CompetitionTeamViewProps> = ({ competitionId, userId }) => {
  const [competition, setCompetition] = useState<FantasyEvent | null>(null);
  const [userCards, setUserCards] = useState<PerformerCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch competition details
        if (competitionId) {
          const eventData = await getEventById(competitionId);
          if (eventData) {
            setCompetition(eventData);
          }
        }

        // Fetch user's cards
        if (userId) {
          const cards = await getUserCards(userId);
          setUserCards(cards);
        }
      } catch (err) {
        console.error('Error fetching competition data:', err);
        setError('Failed to load competition data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [competitionId, userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="text-center text-gray-600">
        Competition not found
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">{competition.title}</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Required Positions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(competition.rules.requiredPositions).map(([position, count]) => (
            count > 0 && (
              <div key={position} className="bg-gray-50 p-4 rounded-lg">
                <div className="font-medium">{position}</div>
                <div className="text-sm text-gray-600">Required: {count}</div>
              </div>
            )
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Your Available Cards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userCards.map(card => (
            <div key={card.id} className="border rounded-lg p-4">
              <div className="font-medium">{card.name}</div>
              <div className="text-sm text-gray-600">
                {card.attributes.positions.join(', ')}
              </div>
            </div>
          ))}
          {userCards.length === 0 && (
            <div className="col-span-full text-center text-gray-600">
              No cards available. Visit the marketplace to purchase cards.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompetitionTeamView;