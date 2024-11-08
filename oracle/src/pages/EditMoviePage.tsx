import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Edit } from 'lucide-react';

const EditMoviePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    setIsSearching(true);
    // Add search functionality here
    setIsSearching(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
        Edit Existing Movie
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search for a movie title..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center disabled:opacity-50"
          >
            <Search className="mr-2" size={18} />
            {isSearching ? 'Searching...' : 'Search Movies'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditMoviePage;