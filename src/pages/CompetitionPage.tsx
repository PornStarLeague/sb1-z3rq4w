import React, { useState, useEffect } from 'react';
import { Trophy, Calendar, Users, DollarSign, Search, Filter } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import CompetitionCard from '../components/CompetitionCard';
import CompetitionTeamView from '../components/CompetitionTeamView';
import { getUserCompetitions } from '../services/competition';

interface Competition {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  entryFee: number;
  prizePool: number;
  maxParticipants: number;
  currentParticipants: number;
  status: 'draft' | 'upcoming' | 'active' | 'completed';
  roster: {
    [key: string]: number;
  };
}

const CompetitionPage: React.FC = () => {
  const { account } = useAuth();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [userTeams, setUserTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    if (account) {
      fetchCompetitionsAndTeams();
    }
  }, [account]);

  const fetchCompetitionsAndTeams = async () => {
    try {
      setLoading(true);
      const [allCompetitions, userCompetitions] = await Promise.all([
        fetchCompetitions(),
        getUserCompetitions(account!)
      ]);

      setCompetitions(allCompetitions);
      setUserTeams(userCompetitions);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load competitions');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompetitions = async () => {
    const competitionsRef = collection(db, 'competitions');
    const q = query(competitionsRef, where('status', 'in', ['active', 'upcoming']));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Competition[];
  };

  const filteredCompetitions = competitions.filter(competition => {
    const matchesSearch = competition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      competition.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || competition.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCompetitions = filteredCompetitions.filter(c => c.status === 'active');
  const upcomingCompetitions = filteredCompetitions.filter(c => c.status === 'upcoming');

  const hasTeamInCompetition = (competitionId: string) => {
    return userTeams.some(team => team.id === competitionId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Competitions</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search competitions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Active Competitions */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Trophy className="mr-2 text-yellow-500" size={24} />
          Active Competitions
        </h2>

        {activeCompetitions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCompetitions.map(competition => (
              <CompetitionCard
                key={competition.id}
                competition={{
                  ...competition,
                  rules: {
                    entryFee: competition.entryFee,
                    maxEntries: 1,
                    scoringSystem: {},
                    maxPerformers: Object.values(competition.roster).reduce((a, b) => a + b, 0),
                    requiredPositions: competition.roster,
                    restrictions: []
                  },
                  prizes: [{
                    rank: 1,
                    amount: competition.prizePool,
                    type: 'points',
                    description: 'First Place Prize'
                  }],
                  moviePool: []
                }}
                userAddress={account}
                hasTeam={hasTeamInCompetition(competition.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Trophy size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">No Active Competitions</h3>
            <p className="text-gray-600">Check back soon for new competitions!</p>
          </div>
        )}
      </section>

      {/* Upcoming Competitions */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Calendar className="mr-2 text-blue-500" size={24} />
          Upcoming Competitions
        </h2>

        {upcomingCompetitions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingCompetitions.map(competition => (
              <CompetitionCard
                key={competition.id}
                competition={{
                  ...competition,
                  rules: {
                    entryFee: competition.entryFee,
                    maxEntries: 1,
                    scoringSystem: {},
                    maxPerformers: Object.values(competition.roster).reduce((a, b) => a + b, 0),
                    requiredPositions: competition.roster,
                    restrictions: []
                  },
                  prizes: [{
                    rank: 1,
                    amount: competition.prizePool,
                    type: 'points',
                    description: 'First Place Prize'
                  }],
                  moviePool: []
                }}
                userAddress={account}
                hasTeam={hasTeamInCompetition(competition.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">No Upcoming Competitions</h3>
            <p className="text-gray-600">Stay tuned for future competitions!</p>
          </div>
        )}
      </section>

      {/* User's Teams */}
      {userTeams.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Users className="mr-2 text-purple-500" size={24} />
            Your Teams
          </h2>
          <div className="space-y-6">
            {userTeams.map(team => (
              <CompetitionTeamView
                key={team.id}
                team={team.team}
                totalPoints={team.teamPoints}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default CompetitionPage;