import React from 'react';
import { Trophy } from 'lucide-react';
import CardItem from '../cards/CardItem';

interface CompetitionTeamViewProps {
  team: {
    [position: string]: any[];
  };
  totalPoints: number;
}

const CompetitionTeamView: React.FC<CompetitionTeamViewProps> = ({ team, totalPoints }) => {
  if (!team || Object.keys(team).length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <Trophy className="mx-auto text-gray-400 mb-4" size={32} />
        <p className="text-gray-600">No team members selected yet</p>
      </div>
    );
  }

  return (
    <div className="border-t pt-4 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold">Your Team</h4>
        <div className="flex items-center text-green-600">
          <Trophy size={20} className="mr-2" />
          <span className="font-bold">{totalPoints} points</span>
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(team).map(([position, cards]) => (
          <div key={position} className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-medium mb-3">{position}</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cards.map((card) => (
                <CardItem
                  key={card.id}
                  card={card}
                  onPurchase={() => {}}
                  purchasing={false}
                  showPurchase={false}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompetitionTeamView;