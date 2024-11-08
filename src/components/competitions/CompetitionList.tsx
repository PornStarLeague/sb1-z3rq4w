import React from 'react';
import { Trophy, Calendar, Users, DollarSign } from 'lucide-react';
import { FantasyEvent } from '../../types/event';
import CompetitionTeamView from './CompetitionTeamView';

interface CompetitionListProps {
  competitions: FantasyEvent[];
}

const CompetitionList: React.FC<CompetitionListProps> = ({ competitions }) => {
  if (competitions.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <Trophy className="mx-auto text-gray-400 mb-4" size={48} />
        <h3 className="text-xl font-bold mb-2">No Active Competitions</h3>
        <p className="text-gray-600">
          Join a competition to start earning points with your performers!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {competitions.map((competition) => (
        <div key={competition.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">{competition.title}</h3>
              <p className="text-gray-600">{competition.description}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              competition.status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {competition.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
              <span>Prize Pool: {competition.prizePool} points</span>
            </div>
          </div>

          <CompetitionTeamView
            team={competition.team}
            totalPoints={competition.teamPoints}
          />
        </div>
      ))}
    </div>
  );
};

export default CompetitionList;