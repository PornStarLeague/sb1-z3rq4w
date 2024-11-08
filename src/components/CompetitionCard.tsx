import React, { useState } from 'react';
import { Calendar, Users, Trophy, DollarSign } from 'lucide-react';
import { FantasyEvent } from '../types/event';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../config/firebase';
import CompetitionTeamBuilder from './CompetitionTeamBuilder';
import { submitCompetitionTeam } from '../services/competition';

interface CompetitionCardProps {
  competition: FantasyEvent;
  userAddress: string | null;
  hasTeam?: boolean;
}

const CompetitionCard: React.FC<CompetitionCardProps> = ({ competition, userAddress, hasTeam }) => {
  const { points, refreshPoints } = useAuth();
  const [entering, setEntering] = useState(false);
  const [showTeamBuilder, setShowTeamBuilder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEnterCompetition = async () => {
    if (!userAddress) return;

    try {
      setEntering(true);
      setError(null);

      // Check if user has enough points
      if (points < competition.rules.entryFee) {
        throw new Error('Insufficient points');
      }

      // Check if competition is full
      if (competition.currentParticipants >= competition.maxParticipants) {
        throw new Error('Competition is full');
      }

      // Show team builder after validation
      setShowTeamBuilder(true);
    } catch (err: any) {
      console.error('Error entering competition:', err);
      setError(err.message || 'Failed to enter competition');
    } finally {
      setEntering(false);
    }
  };

  const handleTeamSubmit = async (team: { [position: string]: string[] }) => {
    if (!userAddress) return;

    try {
      // Submit team
      await submitCompetitionTeam(userAddress, competition.id!, team);

      // Update competition participants
      const competitionRef = doc(db, 'competitions', competition.id!);
      await updateDoc(competitionRef, {
        currentParticipants: increment(1)
      });

      // Deduct entry fee from user
      const userRef = doc(db, 'users', userAddress);
      await updateDoc(userRef, {
        points: increment(-competition.rules.entryFee)
      });

      // Refresh user points
      await refreshPoints();

      // Hide team builder
      setShowTeamBuilder(false);
    } catch (err: any) {
      console.error('Error submitting team:', err);
      setError(err.message || 'Failed to submit team');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold">{competition.title}</h3>
        <span className={`px-2 py-1 rounded-full text-sm ${
          competition.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {competition.status}
        </span>
      </div>

      <p className="text-gray-600 mb-4">{competition.description}</p>

      <div className="space-y-2 text-sm">
        <div className="flex items-center text-gray-600">
          <Calendar size={16} className="mr-2" />
          <span>
            {new Date(competition.startDate).toLocaleDateString()} - {new Date(competition.endDate).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center text-gray-600">
          <Users size={16} className="mr-2" />
          <span>
            {competition.currentParticipants} / {competition.maxParticipants} participants
          </span>
        </div>

        <div className="flex items-center text-gray-600">
          <DollarSign size={16} className="mr-2" />
          <span>Entry Fee: {competition.rules.entryFee} points</span>
        </div>

        <div className="flex items-center text-gray-600">
          <Trophy size={16} className="mr-2" />
          <span>Prize Pool: {competition.prizePool} points</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <h4 className="font-medium mb-2">Required Positions:</h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(competition.rules.requiredPositions).map(([position, count]) => (
            count > 0 && (
              <span key={position} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {position}: {count}
              </span>
            )
          ))}
        </div>
      </div>

      {error && (
        <div className="mt-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {showTeamBuilder ? (
        <CompetitionTeamBuilder
          competitionId={competition.id!}
          requiredPositions={competition.rules.requiredPositions}
          onSubmit={handleTeamSubmit}
        />
      ) : (
        !hasTeam && (
          <button
            onClick={handleEnterCompetition}
            disabled={entering || !userAddress || points < competition.rules.entryFee}
            className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {entering ? 'Entering...' : hasTeam ? 'Team Submitted' : 'Enter Competition'}
          </button>
        )
      )}

      {hasTeam && (
        <div className="mt-6 text-center">
          <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full">
            Team Submitted
          </span>
        </div>
      )}
    </div>
  );
};

export default CompetitionCard;