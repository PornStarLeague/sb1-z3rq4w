import React from 'react';
import { Activity } from 'lucide-react';
import { POSITION_CATEGORIES, PerformerPosition } from '../../constants/positions';

interface PositionSelectorProps {
  selectedPositions: PerformerPosition[];
  onToggle: (position: PerformerPosition) => void;
}

const PositionSelector: React.FC<PositionSelectorProps> = ({
  selectedPositions,
  onToggle
}) => {
  const renderPositionCategory = (
    title: string,
    positions: readonly string[],
    colorClass: string
  ) => (
    <div className="space-y-2">
      <h3 className="font-medium text-gray-700">{title}</h3>
      <div className="grid grid-cols-2 gap-2">
        {positions.map((position) => (
          <label
            key={position}
            className={`inline-flex items-center p-2 rounded-md ${
              selectedPositions.includes(position as PerformerPosition)
                ? colorClass
                : 'bg-gray-50 hover:bg-gray-100'
            } transition-colors cursor-pointer`}
          >
            <input
              type="checkbox"
              checked={selectedPositions.includes(position as PerformerPosition)}
              onChange={() => onToggle(position as PerformerPosition)}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="ml-2">{position}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center">
        <Activity className="mr-2" size={20} />
        Positions
      </h2>

      <div className="space-y-6">
        {renderPositionCategory(
          'Main Positions',
          POSITION_CATEGORIES.MAIN,
          'bg-blue-50'
        )}
        {renderPositionCategory(
          'Specialty Positions',
          POSITION_CATEGORIES.SPECIALTY,
          'bg-purple-50'
        )}
        {renderPositionCategory(
          'Premium Positions',
          POSITION_CATEGORIES.PREMIUM,
          'bg-yellow-50'
        )}
      </div>
    </div>
  );
};

export default PositionSelector;