import React from 'react';
import { Performer } from '../../types/movie';

interface PerformerSelectProps {
  performers: Performer[];
  selectedPerformers: string[];
  onSelect: (performerId: string) => void;
}

const PerformerSelect: React.FC<PerformerSelectProps> = ({
  performers,
  selectedPerformers,
  onSelect
}) => {
  return (
    <div className="space-y-2">
      <div className="space-y-2">
        {performers.map((performer) => (
          <div key={performer.id} className="flex items-center bg-gray-50 p-3 rounded-md">
            <input
              type="checkbox"
              id={`performer-${performer.id}`}
              checked={selectedPerformers.includes(performer.id)}
              onChange={() => onSelect(performer.id)}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label
              htmlFor={`performer-${performer.id}`}
              className="ml-3 text-gray-700 flex-grow"
            >
              <span className="font-medium">{performer.name}</span>
              <span className="text-gray-500 ml-2">({performer.gender})</span>
            </label>
          </div>
        ))}
        {performers.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No performers available. Add a new performer to continue.
          </p>
        )}
      </div>
    </div>
  );
};

export default PerformerSelect;