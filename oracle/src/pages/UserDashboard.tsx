import React from 'react';
import { Award, Film, DollarSign, TrendingUp, Video } from 'lucide-react';

const UserDashboard: React.FC = () => {
  const userData = {
    username: 'MovieBuff123',
    tokensEarned: 500,
    moviesSubmitted: 15,
    scenesSubmitted: 87,
    recentSubmissions: [
      { type: 'movie', title: 'The Matrix Resurrections', date: '2024-03-15' },
      { type: 'scene', title: 'Inception - Dream Collapse', date: '2024-03-14' },
      { type: 'scene', title: 'Avengers: Endgame - Final Battle', date: '2024-03-13' },
    ]
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Welcome, {userData.username}!</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6 flex items-center">
          <DollarSign className="text-green-500 mr-4" size={32} />
          <div>
            <p className="text-sm text-gray-600">Tokens Earned</p>
            <p className="text-2xl font-bold">{userData.tokensEarned}</p>
          </div>
        </div>
        <div className="card p-6 flex items-center">
          <Film className="text-blue-500 mr-4" size={32} />
          <div>
            <p className="text-sm text-gray-600">Movies Submitted</p>
            <p className="text-2xl font-bold">{userData.moviesSubmitted}</p>
          </div>
        </div>
        <div className="card p-6 flex items-center">
          <Award className="text-purple-500 mr-4" size={32} />
          <div>
            <p className="text-sm text-gray-600">Scenes Submitted</p>
            <p className="text-2xl font-bold">{userData.scenesSubmitted}</p>
          </div>
        </div>
        <div className="card p-6 flex items-center">
          <TrendingUp className="text-blue-500 mr-4" size={32} />
          <div>
            <p className="text-sm text-gray-600">Ranking</p>
            <p className="text-2xl font-bold">#42</p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">Recent Submissions</h2>
        <ul className="space-y-4">
          {userData.recentSubmissions.map((submission, index) => (
            <li key={index} className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center">
                {submission.type === 'movie' ? (
                  <Film className="text-blue-500 mr-2" size={18} />
                ) : (
                  <Video className="text-purple-500 mr-2" size={18} />
                )}
                <div>
                  <p className="font-medium">{submission.title}</p>
                  <p className="text-sm text-gray-600">{submission.type === 'movie' ? 'Movie' : 'Scene'}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">{submission.date}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserDashboard;