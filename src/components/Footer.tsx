import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">Fantasy Movie League</h3>
            <p className="text-sm">Experience the thrill of fantasy sports with your favorite movie stars!</p>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
            <ul className="text-sm">
              <li><Link to="/" className="hover:text-blue-300">Home</Link></li>
              <li><Link to="/marketplace" className="hover:text-blue-300">NFT Marketplace</Link></li>
              <li><Link to="/leaderboard" className="hover:text-blue-300">Leaderboard</Link></li>
              <li><Link to="/faq" className="hover:text-blue-300">FAQ</Link></li>
            </ul>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-2">Connect</h4>
            <ul className="text-sm">
              <li><a href="#" className="hover:text-blue-300">Twitter</a></li>
              <li><a href="#" className="hover:text-blue-300">Discord</a></li>
              <li><a href="#" className="hover:text-blue-300">Telegram</a></li>
            </ul>
          </div>
          <div className="w-full md:w-1/4">
            <h4 className="text-lg font-semibold mb-2">Newsletter</h4>
            <p className="text-sm mb-2">Stay updated with the latest news and competitions!</p>
            <input type="email" placeholder="Enter your email" className="w-full px-3 py-2 text-gray-700 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="mt-8 text-center text-sm">
          <p>&copy; 2024 Fantasy Movie League. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;