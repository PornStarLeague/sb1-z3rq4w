import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Edit, UserPlus } from 'lucide-react';

const OraclePage: React.FC = () => {
  return (
    <div className="space-y-12 py-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-blue-600">Fantasy Movie League Oracle</h1>
        <p className="text-xl mb-8 text-gray-600">Contribute movie data and earn tokens!</p>
      </section>

      <section className="max-w-md mx-auto">
        <div className="space-y-4">
          <Link to="/oracle/submit-movie" className="btn btn-primary w-full flex items-center justify-center">
            <Film className="mr-2" size={18} />
            Submit a New Movie
          </Link>
          <Link to="/oracle/submit-performer" className="btn btn-secondary w-full flex items-center justify-center">
            <UserPlus className="mr-2" size={18} />
            Add New Performer
          </Link>
          <Link to="/oracle/edit-movie" className="btn btn-secondary w-full flex items-center justify-center">
            <Edit className="mr-2" size={18} />
            Edit Existing Movie
          </Link>
        </div>
      </section>
    </div>
  );
};

export default OraclePage;