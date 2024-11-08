import React from 'react';
import { X } from 'lucide-react';
import { Performer } from '../../types/movie';

interface PerformerInputProps {
  performer: Performer;
  index: number;
  onUpdate: (index: number, field: keyof Performer, value: string) => void;
  onRemove: (index: number) => void;
  showRemove: boolean;
}

const PerformerInput: React.FC<PerformerInputProps> = ({
  performer,
  index,
  onUpdate,
  onRemove,
  showRemove
}) => {
  return (
    <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-md">
      <input
        type="text"
        value={performer.name}
        onChange={(e) => onUpdate(index, 'name', e.target.value)}
        placeholder="Performer Name"
        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
      />
      <select
        value={performer.gender}
        onChange={(e) => onUpdate(index, 'gender', e.target.value as 'Male' | 'Female')}
        className="rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
      >
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
      {showRemove && (
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-red-500 hover:text-red-700"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};

export default PerformerInput;