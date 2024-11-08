import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">Fantasy Movie League Oracle</h3>
            <p className="text-sm">Contribute movie data and earn tokens!</p>
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
            <ul className="text-sm">
              <li><Link to="/" className="hover:text-blue-300">Home</Link></li>
              <li><Link to="/submit-movie" className="hover:text-blue-300">Submit Movie</Link></li>
              <li><Link to="/dashboard" className="hover:text-blue-300">Dashboard</Link></li>
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h4 className="text-lg font-semibold mb-2">Connect</h4>
            <ul className="text-sm">
              <li><a href="#" className="hover:text-blue-300">Twitter</a></li>
              <li><a href="#" className="hover:text-blue-300">Discord</a></li>
              <li><a href="#" className="hover:text-blue-300">Telegram</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center text-sm">
          <p>&copy; 2024 Fantasy Movie League Oracle. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;