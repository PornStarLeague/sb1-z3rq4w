import React, { useState } from 'react';
import { Film } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp, writeBatch, doc, increment } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

interface MovieData {
  title: string;
  releaseDate: string;
  director: string;
  genre: string;
  description: string;
}

const MovieSubmissionPage: React.FC = () => {
  const navigate = useNavigate();
  const { account } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [movieData, setMovieData] = useState<MovieData>({
    title: '',
    releaseDate: '',
    director: '',
    genre: '',
    description: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMovieData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!movieData.title.trim()) {
      setError('Movie title is required');
      return false;
    }
    if (!movieData.releaseDate) {
      setError('Release date is required');
      return false;
    }
    if (!movieData.director.trim()) {
      setError('Director name is required');
      return false;
    }
    if (!movieData.genre.trim()) {
      setError('Genre is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!account) {
      setError('Please connect your wallet to submit movies');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const batch = writeBatch(db);
      
      // Add the movie document
      const moviesRef = collection(db, 'movies');
      const movieDoc = await addDoc(moviesRef, {
        ...movieData,
        submittedBy: account,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'pending'
      });

      // Update user's submission count
      const userRef = doc(db, 'users', account);
      batch.update(userRef, {
        moviesSubmitted: increment(1),
        points: increment(10), // Award points for submission
        updatedAt: serverTimestamp()
      });

      // Commit the batch
      await batch.commit();

      // Navigate to scenes page
      navigate('/submit-movie/scenes', { 
        state: { 
          movieId: movieDoc.id,
          movieTitle: movieData.title
        }
      });
    } catch (err) {
      console.error('Error submitting movie:', err);
      setError('Failed to submit movie. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Submit a New Movie</h1>
      
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Movie Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={movieData.title}
              onChange={handleInputChange}
              required
              className="input"
              placeholder="Enter movie title"
            />
          </div>

          <div>
            <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-700">Release Date</label>
            <input
              type="date"
              id="releaseDate"
              name="releaseDate"
              value={movieData.releaseDate}
              onChange={handleInputChange}
              required
              className="input"
            />
          </div>

          <div>
            <label htmlFor="director" className="block text-sm font-medium text-gray-700">Director</label>
            <input
              type="text"
              id="director"
              name="director"
              value={movieData.director}
              onChange={handleInputChange}
              required
              className="input"
              placeholder="Enter director's name"
            />
          </div>

          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-gray-700">Genre</label>
            <input
              type="text"
              id="genre"
              name="genre"
              value={movieData.genre}
              onChange={handleInputChange}
              required
              className="input"
              placeholder="Enter movie genre"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={movieData.description}
              onChange={handleInputChange}
              rows={4}
              className="input"
              placeholder="Enter movie description"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-full flex items-center justify-center"
          >
            <Film className="mr-2" size={18} />
            {isSubmitting ? 'Submitting...' : 'Submit Movie'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MovieSubmissionPage;