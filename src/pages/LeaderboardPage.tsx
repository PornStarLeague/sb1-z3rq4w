import React, { useState, useEffect } from 'react';
import { Trophy, Film, Users, Award } from 'lucide-react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { UserProfile } from '../types/user';

interface LeaderboardStats {
  moviesLeaders: UserProfile[];
  nftLeaders: UserProfile[];
  tournamentLeaders: UserProfile[];
}

const LeaderboardPage: React.FC = () => {
  const [stats, setStats] = useState<LeaderboardStats>({
    moviesLeaders: [],
    nftLeaders: [],
    tournamentLeaders: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);
        const usersRef = collection(db, 'users');

        // Fetch top movie submitters
        const movieQuery = query(
          usersRef,
          orderBy('moviesSubmitted', 'desc'),
          limit(10)
        );
        const movieSnapshot = await getDocs(movieQuery);
        const moviesLeaders = movieSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as UserProfile[];

        // Fetch top NFT holders
        const nftQuery = query(
          usersRef,
          orderBy('nftCount', 'desc'),
          limit(10)
        );
        const nftSnapshot = await getDocs(nftQuery);
        const nftLeaders = nftSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as UserProfile[];

        // Fetch tournament winners
        const tournamentQuery = query(
          usersRef,
          orderBy('tournamentWins', 'desc'),
          limit(10)
        );
        const tournamentSnapshot = await getDocs(tournamentQuery);
        const tournamentLeaders = tournamentSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as UserProfile[];

        setStats({
          moviesLeaders,
          nftLeaders,
          tournamentLeaders
        });
      } catch (err) {
        console.error('Error fetching leaderboard data:', err);
        setError('Failed to load leaderboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const LeaderboardSection: React.FC<{
    title: string;
    icon: React.ReactNode;
    leaders: UserProfile[];
    statKey: keyof UserProfile;
    iconColor: string;
  }> = ({ title, icon, leaders, statKey, iconColor }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <div className={`p-2 rounded-full ${iconColor} mr-4`}>
          {icon}
        </div>
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <div className="space-y-4">
        {leaders.map((user, index) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center">
              <span className="w-8 text-xl font-bold text-gray-500">
                #{index + 1}
              </span>
              <span className="font-mono">{formatAddress(user.address)}</span>
            </div>
            <span className="font-bold">
              {user[statKey as keyof UserProfile]}
            </span>
          </div>
        ))}
        {leaders.length === 0 && (
          <p className="text-center text-gray-500 py-4">No data available</p>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Leaderboard</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        <LeaderboardSection
          title="Top Movie Submitters"
          icon={<Film className="text-white" size={24} />}
          leaders={stats.moviesLeaders}
          statKey="moviesSubmitted"
          iconColor="bg-blue-600"
        />
        
        <LeaderboardSection
          title="Top NFT Holders"
          icon={<Users className="text-white" size={24} />}
          leaders={stats.nftLeaders}
          statKey="nftCount"
          iconColor="bg-purple-600"
        />
        
        <LeaderboardSection
          title="Tournament Champions"
          icon={<Trophy className="text-white" size={24} />}
          leaders={stats.tournamentLeaders}
          statKey="tournamentWins"
          iconColor="bg-yellow-600"
        />
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Rankings are updated in real-time based on user activity and achievements.
        </p>
      </div>
    </div>
  );
};

export default LeaderboardPage;