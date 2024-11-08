import React from 'react';
import { Filter, DollarSign } from 'lucide-react';
import { PERFORMER_POSITIONS } from '../../constants/positions';

interface CardFiltersProps {
  minPrice: number;
  maxPrice: number;
  selectedPosition: string;
  onPriceChange: (min: number, max: number) => void;
  onPositionChange: (position: string) => void;
}

const CardFilters: React.FC<CardFiltersProps> = ({
  minPrice,
  maxPrice,
  selectedPosition,
  onPriceChange,
  onPositionChange
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <Filter className="text-blue-600 mr-2" size={20} />
        <h2 className="text-lg font-semibold">Filters</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range
          </label>
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">
              {minPrice} - {maxPrice} points
            </span>
          </div>
          <div className="space-y-4">
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={minPrice}
              onChange={(e) => onPriceChange(parseInt(e.target.value), maxPrice)}
              className="w-full"
            />
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={maxPrice}
              onChange={(e) => onPriceChange(minPrice, parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Position
          </label>
          <select
            value={selectedPosition}
            onChange={(e) => onPositionChange(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            <option value="">All Positions</option>
            {PERFORMER_POSITIONS.map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default CardFilters;