import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Play, DollarSign } from 'lucide-react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { MovieData } from '../types/movie';
import PerformerList from '../components/PerformerList';

const HomePage: React.FC = () => {
  const [recentMovies, setRecentMovies] = useState<MovieData[]>([]);
  const [topPerformers, setTopPerformers] = useState<MovieData['performers']>([]);

  useEffect(() => {
    const fetchRecentMovies = async () => {
      try {
        const moviesRef = collection(db, 'movies');
        const q = query(moviesRef, orderBy('releaseDate', 'desc'), limit(5));
        const querySnapshot = await getDocs(q);
        const movies = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as MovieData[];
        setRecentMovies(movies);

        // Extract unique performers from recent movies
        const uniquePerformers = new Map();
        movies.forEach(movie => {
          movie.performers?.forEach(performer => {
            if (performer.id && !uniquePerformers.has(performer.id)) {
              uniquePerformers.set(performer.id, performer);
            }
          });
        });
        setTopPerformers(Array.from(uniquePerformers.values()));
      } catch (error) {
        console.error('Error fetching recent movies:', error);
      }
    };

    fetchRecentMovies();
  }, []);

  return (
    <div className="space-y-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Fantasy Movie League</h1>
        <p className="text-xl mb-8">Where movie magic meets fantasy sports!</p>
        <Link to="/login" className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300">
          Get Started
        </Link>
      </section>

      <section className="bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <Play className="mx-auto mb-4 text-blue-600" size={48} />
            <h3 className="text-xl font-semibold mb-2">Choose Your Stars</h3>
            <p>Select your favorite movie performers and build your dream team.</p>
          </div>
          <div className="text-center">
            <Trophy className="mx-auto mb-4 text-blue-600" size={48} />
            <h3 className="text-xl font-semibold mb-2">Compete in Leagues</h3>
            <p>Join weekly competitions and climb the leaderboard.</p>
          </div>
          <div className="text-center">
            <DollarSign className="mx-auto mb-4 text-blue-600" size={48} />
            <h3 className="text-xl font-semibold mb-2">Win Rewards</h3>
            <p>Earn NFTs, tokens, and bragging rights as you dominate the league.</p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Featured Performers</h2>
        <PerformerList performers={topPerformers} className="mb-6" />
      </section>

      <section className="bg-white rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Recent Movies</h2>
        <div className="space-y-8">
          {recentMovies.map(movie => (
            <div key={movie.id} className="border-b pb-6 last:border-b-0 last:pb-0">
              <h3 className="text-xl font-semibold text-blue-600 mb-2">{movie.title}</h3>
              <div className="flex flex-wrap items-center gap-2 text-gray-600 mb-4">
                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  Studio: {movie.studio}
                </span>
                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  Released: {new Date(movie.releaseDate).toLocaleDateString()}
                </span>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Featured Performers:</h4>
                <PerformerList performers={movie.performers} />
              </div>
            </div>
          ))}
          {recentMovies.length === 0 && (
            <p className="text-center text-gray-500">No recent movies available.</p>
          )}
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Play?</h2>
        <Link to="/marketplace" className="bg-green-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-green-700 transition duration-300">
          Explore NFT Marketplace
        </Link>
      </section>
    </div>
  );
};

export default HomePage;