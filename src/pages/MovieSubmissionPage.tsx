import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film } from 'lucide-react';
import { collection, addDoc, getDocs, doc, getDoc, setDoc, increment, writeBatch } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { MovieData, Performer } from '../types/movie';
import ErrorMessage from '../components/MovieForm/ErrorMessage';
import PerformerAutocomplete from '../components/MovieForm/PerformerAutocomplete';
import NewPerformerForm from '../components/MovieForm/NewPerformerForm';

const POINTS_PER_MOVIE = 10; // Points awarded for submitting a movie

const MovieSubmissionPage: React.FC = () => {
  const navigate = useNavigate();
  const { account } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNewPerformerForm, setShowNewPerformerForm] = useState(false);
  const [newPerformerName, setNewPerformerName] = useState('');
  const [selectedPerformers, setSelectedPerformers] = useState<string[]>([]);
  const [performers, setPerformers] = useState<Performer[]>([]);
  const [movieData, setMovieData] = useState<MovieData>({
    title: '',
    studio: '',
    releaseDate: '',
    performers: []
  });

  useEffect(() => {
    const fetchPerformers = async () => {
      try {
        const performersRef = collection(db, 'performers');
        const snapshot = await getDocs(performersRef);
        const performersList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Performer[];
        setPerformers(performersList);
      } catch (err) {
        console.error('Error fetching performers:', err);
        setError('Failed to load performers');
      }
    };

    fetchPerformers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMovieData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewPerformer = async (name: string, gender: string) => {
    try {
      const performersRef = collection(db, 'performers');
      const docRef = await addDoc(performersRef, {
        name,
        gender,
        movieCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const newPerformer: Performer = {
        id: docRef.id,
        name,
        gender,
        movieCount: 0
      };

      setPerformers(prev => [...prev, newPerformer]);
      setSelectedPerformers(prev => [...prev, docRef.id]);
      setShowNewPerformerForm(false);
      setNewPerformerName('');
    } catch (err) {
      console.error('Error adding new performer:', err);
      setError('Failed to add new performer');
    }
  };

  const updateUserPoints = async (batch: any, userId: string) => {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      batch.update(userRef, {
        points: increment(POINTS_PER_MOVIE),
        moviesSubmitted: increment(1),
        updatedAt: new Date()
      });
    } else {
      batch.set(userRef, {
        id: userId,
        address: userId,
        points: POINTS_PER_MOVIE,
        moviesSubmitted: 1,
        scenesSubmitted: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!account) {
      setError('Please connect your wallet to submit movies');
      return;
    }

    if (!movieData.title.trim()) {
      setError('Movie title is required');
      return;
    }

    if (!movieData.studio.trim()) {
      setError('Studio name is required');
      return;
    }

    if (!movieData.releaseDate) {
      setError('Release date is required');
      return;
    }

    if (selectedPerformers.length === 0) {
      setError('At least one performer must be selected');
      return;
    }

    setIsSubmitting(true);

    try {
      const batch = writeBatch(db);
      const selectedPerformerData = performers.filter(p => 
        selectedPerformers.includes(p.id!)
      );

      // Add the movie
      const moviesRef = collection(db, 'movies');
      const movieDoc = await addDoc(moviesRef, {
        ...movieData,
        performers: selectedPerformerData,
        submittedBy: account,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Update user points and stats
      await updateUserPoints(batch, account);

      // Commit all changes
      await batch.commit();

      // Navigate to scenes page
      navigate('/oracle/submit-movie/scenes', {
        state: {
          movieId: movieDoc.id,
          movieTitle: movieData.title,
          performers: selectedPerformerData
        }
      });
    } catch (err) {
      console.error('Error submitting movie:', err);
      setError('Failed to submit movie. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
        Submit a New Movie
      </h1>

      <ErrorMessage message={error} />

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Movie Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={movieData.title}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              required
            />
          </div>

          <div>
            <label htmlFor="studio" className="block text-sm font-medium text-gray-700">
              Studio
            </label>
            <input
              type="text"
              id="studio"
              name="studio"
              value={movieData.studio}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              required
            />
          </div>

          <div>
            <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-700">
              Release Date
            </label>
            <input
              type="date"
              id="releaseDate"
              name="releaseDate"
              value={movieData.releaseDate}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              required
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Performers</h3>
            
            {showNewPerformerForm ? (
              <NewPerformerForm
                initialName={newPerformerName}
                onSubmit={handleNewPerformer}
                onCancel={() => {
                  setShowNewPerformerForm(false);
                  setNewPerformerName('');
                }}
              />
            ) : (
              <PerformerAutocomplete
                performers={performers}
                selectedPerformers={selectedPerformers}
                onSelect={(performerId) => {
                  setSelectedPerformers(prev => 
                    prev.includes(performerId)
                      ? prev.filter(id => id !== performerId)
                      : [...prev, performerId]
                  );
                }}
                onAddNew={(name) => {
                  setNewPerformerName(name);
                  setShowNewPerformerForm(true);
                }}
              />
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center disabled:opacity-50"
          >
            <Film className="mr-2" size={18} />
            {isSubmitting ? 'Submitting...' : 'Continue to Add Scenes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MovieSubmissionPage;