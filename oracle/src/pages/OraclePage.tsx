import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Edit, UserPlus, Database } from 'lucide-react';

const OraclePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">
        Fantasy Movie League Oracle
      </h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Content Management Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6 text-blue-600 flex items-center">
            <Film className="mr-2" size={24} />
            Content Management
          </h2>
          <div className="space-y-4">
            <Link 
              to="/oracle/submit-movie" 
              className="w-full flex items-center justify-center bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Film className="mr-2" size={18} />
              Submit New Movie
            </Link>
            <Link 
              to="/oracle/submit-performer" 
              className="w-full flex items-center justify-center bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <UserPlus className="mr-2" size={18} />
              Submit New Performer
            </Link>
          </div>
        </div>

        {/* Data Management Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6 text-purple-600 flex items-center">
            <Database className="mr-2" size={24} />
            Data Management
          </h2>
          <div className="space-y-4">
            <Link 
              to="/oracle/edit-movie" 
              className="w-full flex items-center justify-center bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Edit className="mr-2" size={18} />
              Edit Existing Movie
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Help maintain accurate movie data and earn rewards for your contributions!
        </p>
      </div>
    </div>
  );
};

export default OraclePage;