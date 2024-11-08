import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Award, DollarSign } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-12 py-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-blue-600">Welcome to Fantasy Movie League Oracle</h1>
        <p className="text-xl mb-8 text-gray-600">Contribute movie data and earn tokens!</p>
        <Link to="/login" className="btn btn-primary text-lg">
          Get Started
        </Link>
      </section>

      <section className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card p-6 text-center">
            <Film className="mx-auto mb-4 text-blue-600" size={48} />
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Submit Movie Data</h3>
            <p className="text-gray-600">Add new movies and their basic information to our database.</p>
          </div>
          <div className="card p-6 text-center">
            <Award className="mx-auto mb-4 text-purple-600" size={48} />
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Earn Points</h3>
            <p className="text-gray-600">Get rewarded for your valuable contributions to the platform.</p>
          </div>
          <div className="card p-6 text-center">
            <DollarSign className="mx-auto mb-4 text-green-600" size={48} />
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Convert Points</h3>
            <p className="text-gray-600">Convert your points into valuable tokens.</p>
          </div>
        </div>
      </section>

      <section className="text-center bg-blue-100 py-12 rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-blue-800">Ready to Contribute?</h2>
        <Link to="/submit-movie" className="btn btn-primary">
          Submit a Movie
        </Link>
      </section>
    </div>
  );
};

export default HomePage;