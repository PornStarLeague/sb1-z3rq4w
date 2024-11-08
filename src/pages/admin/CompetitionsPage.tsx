import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, doc, updateDoc, Timestamp, addDoc } from 'firebase/firestore';
import { Calendar, Users, Trophy, Plus } from 'lucide-react';
import { db } from '../../config/firebase';
import AdminNavigation from '../../components/admin/AdminNavigation';
import CreateCompetitionModal from '../../components/admin/CreateCompetitionModal';

interface Competition {
  id?: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'upcoming' | 'active' | 'completed';
  maxParticipants: number;
  prizePool: number;
  roster: {
    [key: string]: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

const CompetitionsPage: React.FC = () => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchCompetitions = async () => {
    try {
      setLoading(true);
      const competitionsRef = collection(db, 'competitions');
      const q = query(competitionsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const fetchedCompetitions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Competition[];

      setCompetitions(fetchedCompetitions);
    } catch (err) {
      console.error('Error fetching competitions:', err);
      setError('Failed to load competitions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const handleCreateCompetition = async (competitionData: Omit<Competition, 'id'>) => {
    try {
      const competitionsRef = collection(db, 'competitions');
      await addDoc(competitionsRef, {
        ...competitionData,
        status: 'draft',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      await fetchCompetitions();
      setShowCreateModal(false);
    } catch (err) {
      console.error('Error creating competition:', err);
      throw new Error('Failed to create competition');
    }
  };

  const handlePostCompetition = async (competitionId: string) => {
    try {
      const competitionRef = doc(db, 'competitions', competitionId);
      await updateDoc(competitionRef, {
        status: 'upcoming',
        updatedAt: Timestamp.now()
      });
      
      await fetchCompetitions();
    } catch (err) {
      console.error('Error posting competition:', err);
      setError('Failed to post competition');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AdminNavigation />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <AdminNavigation />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Competitions</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Create Competition
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {competitions.map(competition => (
          <div key={competition.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">{competition.title}</h3>
              <span className={`px-2 py-1 rounded-full text-sm ${
                competition.status === 'active' ? 'bg-green-100 text-green-800' :
                competition.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                competition.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {competition.status}
              </span>
            </div>

            <p className="text-gray-600 mb-4">{competition.description}</p>

            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <Calendar size={16} className="mr-2" />
                <span>{new Date(competition.startDate).toLocaleDateString()} - {new Date(competition.endDate).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center text-gray-600">
                <Users size={16} className="mr-2" />
                <span>Max Participants: {competition.maxParticipants}</span>
              </div>

              <div className="flex items-center text-gray-600">
                <Trophy size={16} className="mr-2" />
                <span>Prize Pool: {competition.prizePool} points</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <h4 className="font-medium mb-2">Required Positions:</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(competition.roster).map(([position, count]) => (
                  count > 0 && (
                    <span key={position} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {position}: {count}
                    </span>
                  )
                ))}
              </div>
            </div>

            {competition.status === 'draft' && (
              <button
                onClick={() => handlePostCompetition(competition.id!)}
                className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <Trophy size={18} className="mr-2" />
                Post Competition
              </button>
            )}
          </div>
        ))}
      </div>

      {competitions.length === 0 && !loading && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No competitions found</p>
        </div>
      )}

      {showCreateModal && (
        <CreateCompetitionModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateCompetition}
        />
      )}
    </div>
  );
};

export default CompetitionsPage;