import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { FantasyEvent } from '../../types/event';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface DeleteEventModalProps {
  event: FantasyEvent;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteEventModal: React.FC<DeleteEventModalProps> = ({ event, onClose, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (['active', 'completed'].includes(event.status)) {
      setError(`Cannot delete ${event.status} events`);
      return;
    }

    setLoading(true);
    try {
      await deleteDoc(doc(db, 'events', event.id!));
      onDelete();
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center mb-6">
          <AlertTriangle className="text-red-500 mr-4" size={24} />
          <h2 className="text-2xl font-bold">Delete Event</h2>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <p className="mb-6 text-gray-600">
          Are you sure you want to delete "{event.title}"? This action cannot be undone.
        </p>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Delete Event'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteEventModal;