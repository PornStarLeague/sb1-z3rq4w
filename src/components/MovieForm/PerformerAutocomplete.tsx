import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search } from 'lucide-react';
import { Performer } from '../../types/movie';

interface PerformerAutocompleteProps {
  performers: Performer[];
  selectedPerformers: string[];
  onSelect: (performerId: string) => void;
  onAddNew: (name: string) => void;
}

const PerformerAutocomplete: React.FC<PerformerAutocompleteProps> = ({
  performers,
  selectedPerformers,
  onSelect,
  onAddNew
}) => {
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredPerformers = performers.filter(performer =>
    performer.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (performer: Performer) => {
    onSelect(performer.id!);
    setSearch('');
    setShowDropdown(false);
  };

  const handleAddNew = () => {
    if (search.trim()) {
      onAddNew(search.trim());
      setSearch('');
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder="Search performers..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {showDropdown && (search.trim() || filteredPerformers.length > 0) && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredPerformers.map((performer) => (
            <button
              key={performer.id}
              onClick={() => handleSelect(performer)}
              className={`w-full text-left px-4 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 ${
                selectedPerformers.includes(performer.id!) ? 'bg-blue-50' : ''
              }`}
            >
              <span className="font-medium">{performer.name}</span>
              <span className="text-sm text-gray-500 ml-2">({performer.gender})</span>
            </button>
          ))}
          
          {search.trim() && !filteredPerformers.some(p => 
            p.name.toLowerCase() === search.toLowerCase()
          ) && (
            <button
              onClick={handleAddNew}
              className="w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-50 focus:outline-none focus:bg-blue-50 flex items-center"
            >
              <Plus size={16} className="mr-2" />
              Add "{search}" as new performer
            </button>
          )}
        </div>
      )}

      <div className="mt-4 space-y-2">
        {selectedPerformers.map((id) => {
          const performer = performers.find(p => p.id === id);
          if (!performer) return null;
          
          return (
            <div key={id} className="flex items-center justify-between bg-blue-50 px-4 py-2 rounded-md">
              <div>
                <span className="font-medium">{performer.name}</span>
                <span className="text-sm text-gray-500 ml-2">({performer.gender})</span>
              </div>
              <button
                onClick={() => onSelect(id)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PerformerAutocomplete;