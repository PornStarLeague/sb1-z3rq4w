import React, { useState, useEffect } from 'react';
import { Users, Trophy, AlertCircle } from 'lucide-react';
import { PerformerCard } from '../types/card';
import { getUserCards } from '../services/cards';
import { useAuth } from '../context/AuthContext';

interface CompetitionTeamBuilderProps {
  competitionId: string;
  requiredPositions: { [key: string]: number };
  onSubmit: (team: { [position: string]: string[] }) => Promise<void>;
}

const CompetitionTeamBuilder: React.FC<CompetitionTeamBuilderProps> = ({
  competitionId,
  requiredPositions,
  onSubmit
}) => {
  const { account } = useAuth();
  const [ownedCards, setOwnedCards] = useState<PerformerCard[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<{ [position: string]: string[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Filter out positions with 0 required performers
  const activePositions = Object.entries(requiredPositions)
    .filter(([_, count]) => count > 0)
    .reduce((acc, [position, count]) => {
      acc[position] = count;
      return acc;
    }, {} as { [key: string]: number });

  useEffect(() => {
    if (account) {
      fetchOwnedCards();
    }
  }, [account]);

  const fetchOwnedCards = async () => {
    try {
      setLoading(true);
      const cards = await getUserCards(account!);
      setOwnedCards(cards);
      
      // Initialize selectedTeam with empty arrays for each active position
      const initialTeam = Object.keys(activePositions).reduce((acc, position) => {
        acc[position] = [];
        return acc;
      }, {} as { [position: string]: string[] });
      setSelectedTeam(initialTeam);
    } catch (err) {
      console.error('Error fetching owned cards:', err);
      setError('Failed to load your cards');
    } finally {
      setLoading(false);
    }
  };

  // Check if a card is already selected in any position
  const isCardSelectedAnywhere = (cardId: string): boolean => {
    return Object.values(selectedTeam).some(positionCards => 
      positionCards.includes(cardId)
    );
  };

  const handleCardSelect = (position: string, cardId: string) => {
    setSelectedTeam(prev => {
      const currentPositionCards = prev[position] || [];

      // If card is already selected in this position, remove it
      if (currentPositionCards.includes(cardId)) {
        return {
          ...prev,
          [position]: currentPositionCards.filter(id => id !== cardId)
        };
      }

      // If card is already selected in another position, show error
      if (isCardSelectedAnywhere(cardId)) {
        setError('Each performer can only be selected once');
        return prev;
      }

      // If position is full, don't add
      if (currentPositionCards.length >= activePositions[position]) {
        setError(`Maximum ${activePositions[position]} performers allowed for ${position}`);
        return prev;
      }

      // Clear any previous errors
      setError(null);

      // Add card to position
      return {
        ...prev,
        [position]: [...currentPositionCards, cardId]
      };
    });
  };

  const isTeamComplete = () => {
    return Object.entries(activePositions).every(([position, required]) => 
      selectedTeam[position]?.length === required
    );
  };

  const handleSubmit = async () => {
    if (!isTeamComplete()) {
      setError('Please fill all required positions');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onSubmit(selectedTeam);
    } catch (err: any) {
      setError(err.message || 'Failed to submit team');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Trophy className="mr-2" size={24} />
          Build Your Team
        </h2>

        {error && (
          <div className="mb-4 flex items-center bg-red-50 border-l-4 border-red-500 p-4">
            <AlertCircle className="text-red-500 mr-2" size={20} />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {Object.entries(activePositions).map(([position, required]) => (
          <div key={position} className="mb-6 last:mb-0">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">{position}</h3>
              <span className="text-sm text-gray-600">
                {selectedTeam[position]?.length || 0} / {required} selected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {ownedCards
                .filter(card => card.attributes.positions.includes(position))
                .map(card => {
                  const isSelected = selectedTeam[position]?.includes(card.id);
                  const isSelectedElsewhere = !isSelected && isCardSelectedAnywhere(card.id);

                  return (
                    <div
                      key={card.id}
                      onClick={() => !isSelectedElsewhere && handleCardSelect(position, card.id)}
                      className={`cursor-pointer p-4 rounded-lg border-2 transition-colors ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : isSelectedElsewhere
                          ? 'border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={card.image}
                          alt={card.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-medium">{card.name}</h4>
                          <p className="text-sm text-gray-600">
                            {card.attributes.positions.join(', ')}
                          </p>
                          {isSelectedElsewhere && (
                            <p className="text-xs text-red-500 mt-1">
                              Already selected
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}

        <button
          onClick={handleSubmit}
          disabled={!isTeamComplete() || submitting}
          className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <Users className="mr-2" size={18} />
          {submitting ? 'Submitting Team...' : 'Submit Team'}
        </button>
      </div>
    </div>
  );
};

export default CompetitionTeamBuilder;