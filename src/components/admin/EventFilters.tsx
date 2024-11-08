import React from 'react';
import { X } from 'lucide-react';
import { EventType, EventStatus } from '../../types/event';

interface EventFiltersProps {
  filters: {
    type: EventType | '';
    status: EventStatus | '';
  };
  onChange: (filters: { type: EventType | ''; status: EventStatus | '' }) => void;
  onClose: () => void;
}

const EVENT_TYPES: EventType[] = ['weekly', 'monthly', 'special'];
const EVENT_STATUSES: EventStatus[] = ['draft', 'upcoming', 'active', 'completed', 'cancelled'];

const EventFilters: React.FC<EventFiltersProps> = ({ filters, onChange, onClose }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => onChange({ ...filters, type: e.target.value as EventType })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            <option value="">All Types</option>
            {EVENT_TYPES.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onChange({ ...filters, status: e.target.value as EventStatus })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            <option value="">All Statuses</option>
            {EVENT_STATUSES.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => onChange({ type: '', status: '' })}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default EventFilters;