import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, User, Ruler, Award, Star, Film } from 'lucide-react';
import { collection, doc, getDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { PerformerCard as PerformerCardType } from '../types/card';
import PerformerCard from '../components/PerformerCard';

interface PerformerProfile {
  id: string;
  name: string;
  gender: string;
  dateOfBirth: string;
  bio: string;
  height?: string;
  measurements?: string;
  positions: string[];
  imageUrl?: string;
  stats: {
    totalMovies: number;
    averageRating: number;
    topPosition: string;
  };
}

const PerformerProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [performer, setPerformer] = useState<PerformerProfile | null>(null);
  const [cards, setCards] = useState<PerformerCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchPerformerData();
    }
  }, [id]);

  const fetchPerformerData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch performer details
      const performerRef = doc(db, 'performers', id!);
      const performerDoc = await getDoc(performerRef);

      if (!performerDoc.exists()) {
        setError('Performer not found');
        return;
      }

      const performerData = performerDoc.data();
      
      // Fetch performer's cards
      const cardsRef = collection(db, 'performerCards');
      const q = query(cardsRef, where('performerId', '==', id));
      const cardsSnapshot = await getDocs(q);
      const performerCards = cardsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PerformerCardType[];

      setPerformer({
        id: performerDoc.id,
        ...performerData,
        stats: {
          totalMovies: performerData.movieCount || 0,
          averageRating: performerData.averageRating || 0,
          topPosition: performerData.positions?.[0] || 'N/A'
        }
      } as PerformerProfile);

      setCards(performerCards);
    } catch (err) {
      console.error('Error fetching performer data:', err);
      setError('Failed to load performer data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !performer) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error || 'Failed to load performer'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Image */}
          <div className="w-full md:w-1/3">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              {performer.imageUrl ? (
                <img
                  src={performer.imageUrl}
                  alt={performer.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="text-gray-400" size={64} />
                </div>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-4">{performer.name}</h1>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <Calendar className="mr-2" size={20} />
                <span>Born: {new Date(performer.dateOfBirth).toLocaleDateString()}</span>
              </div>
              
              {performer.height && (
                <div className="flex items-center text-gray-600">
                  <Ruler className="mr-2" size={20} />
                  <span>Height: {performer.height}</span>
                </div>
              )}
              
              {performer.measurements && (
                <div className="flex items-center text-gray-600">
                  <Star className="mr-2" size={20} />
                  <span>Measurements: {performer.measurements}</span>
                </div>
              )}
              
              <div className="flex items-center text-gray-600">
                <Film className="mr-2" size={20} />
                <span>Movies: {performer.stats.totalMovies}</span>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Positions</h2>
              <div className="flex flex-wrap gap-2">
                {performer.positions.map((position, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {position}
                  </span>
                ))}
              </div>
            </div>

            {performer.bio && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Bio</h2>
                <p className="text-gray-700">{performer.bio}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Movies</p>
              <p className="text-2xl font-bold text-blue-600">
                {performer.stats.totalMovies}
              </p>
            </div>
            <Film className="text-blue-600" size={24} />
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-purple-600">
                {performer.stats.averageRating.toFixed(1)}
              </p>
            </div>
            <Star className="text-purple-600" size={24} />
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Top Position</p>
              <p className="text-2xl font-bold text-green-600">
                {performer.stats.topPosition}
              </p>
            </div>
            <Award className="text-green-600" size={24} />
          </div>
        </div>
      </div>

      {/* Available Cards */}
      {cards.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Available Cards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cards.map((card) => (
              <PerformerCard key={card.id} card={card} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformerProfilePage;