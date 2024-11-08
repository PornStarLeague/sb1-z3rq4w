import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { PERFORMER_POSITIONS } from '../../types/action';

interface RosterPositionsManagerProps {
  positions: { [key: string]: number };
  onChange: (positions: { [key: string]: number }) => void;
  maxPerformers: number;
}

const RosterPositionsManager: React.FC<RosterPositionsManagerProps> = ({
  positions,
  onChange,
  maxPerformers
}) => {
  const [error, setError] = useState<string | null>(null);

  const handlePositionChange = (position: string, count: number) => {
    const newPositions = { ...positions };
    
    if (count < 0) {
      delete newPositions[position];
    } else {
      newPositions[position] = count;
    }

    // Validate total doesn't exceed maxPerformers
    const total = Object.values(newPositions).reduce((sum, val) => sum + val, 0);
    if (total > maxPerformers) {
      setError(`Total positions cannot exceed ${maxPerformers}`);
      return;
    }

    setError(null);
    onChange(newPositions);
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PERFORMER_POSITIONS.map(position => (
          <div key={position} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">{position}</span>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => handlePositionChange(position, (positions[position] || 0) - 1)}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center">{positions[position] || 0}</span>
              <button
                type="button"
                onClick={() => handlePositionChange(position, (positions[position] || 0) + 1)}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 text-sm text-gray-600">
        Total: {Object.values(positions).reduce((sum, val) => sum + val, 0)} / {maxPerformers}
      </div>
    </div>
  );
};

export default RosterPositionsManager;