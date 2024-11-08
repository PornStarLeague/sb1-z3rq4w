import React, { useState } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { addSampleCardsToMarketplace } from '../../services/sampleCards';
import AdminNavigation from '../../components/admin/AdminNavigation';

const CardsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleResetCards = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      await addSampleCardsToMarketplace();
      setSuccess('Successfully reset all cards in the marketplace!');
    } catch (err) {
      console.error('Error resetting cards:', err);
      setError('Failed to reset cards. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <AdminNavigation />
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Manage Cards</h1>
        <button
          onClick={handleResetCards}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Plus size={20} className="mr-2" />
          Reset Sample Cards
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 flex items-start">
          <AlertCircle className="text-red-500 mr-3 mt-0.5" size={20} />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4">
          <p className="text-green-700">{success}</p>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};

export default CardsPage;