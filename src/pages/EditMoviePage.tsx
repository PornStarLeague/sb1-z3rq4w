import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Edit } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { MovieData } from '../types/movie';

const EditMoviePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<MovieData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a movie title to search');
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const moviesRef = collection(db, 'movies');
      const searchTermLower = searchTerm.toLowerCase();
      
      // Get all movies and filter client-side for better search results
      const q = query(moviesRef);
      const querySnapshot = await getDocs(q);
      
      const results = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(movie => 
          movie.title.toLowerCase().includes(searchTermLower)
        ) as MovieData[];

      setSearchResults(results);
      
      if (results.length === 0) {
        setError('No movies found matching your search');
      }
    } catch (err) {
      console.error('Error searching movies:', err);
      setError('Failed to search movies. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleEditMovie = (movieId: string) => {
    navigate(`/oracle/edit-movie/${movieId}`);
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
        Edit Existing Movie
      </h1>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

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

        {searchResults.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Search Results</h2>
            {searchResults.map((movie) => (
              <div
                key={movie.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-blue-600">{movie.title}</h3>
                    <p className="text-sm text-gray-600">
                      Released: {new Date(movie.releaseDate).toLocaleDateString()}
                    </p>
                    {movie.studio && (
                      <p className="text-sm text-gray-600">Studio: {movie.studio}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleEditMovie(movie.id!)}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={18} className="mr-1" />
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditMoviePage;