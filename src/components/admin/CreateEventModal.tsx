import React, { useState } from 'react';
import { X } from 'lucide-react';
import { FantasyEvent, EventType, EventStatus } from '../../types/event';
import RosterPositionsManager from './RosterPositionsManager';

interface CreateEventModalProps {
  onClose: () => void;
  onCreate: (eventData: Partial<FantasyEvent>) => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState<Partial<FantasyEvent>>({
    title: '',
    description: '',
    type: 'weekly',
    status: 'draft',
    startDate: '',
    endDate: '',
    prizes: [],
    rules: {
      maxEntries: 1,
      entryFee: 0,
      scoringSystem: {},
      maxPerformers: 5,
      requiredPositions: {}
    },
    moviePool: [],
    maxParticipants: 100,
    currentParticipants: 0
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePositionsChange = (positions: { [key: string]: number }) => {
    setFormData(prev => ({
      ...prev,
      rules: {
        ...prev.rules!,
        requiredPositions: positions
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title?.trim()) {
      setError('Title is required');
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      setError('Start and end dates are required');
      return;
    }

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      setError('End date must be after start date');
      return;
    }

    const totalPositions = Object.values(formData.rules?.requiredPositions || {}).reduce((sum, val) => sum + val, 0);
    if (totalPositions === 0) {
      setError('At least one position must be required');
      return;
    }

    if (totalPositions > formData.rules?.maxPerformers!) {
      setError('Total required positions cannot exceed max performers');
      return;
    }

    setLoading(true);
    try {
      await onCreate(formData);
    } catch (err) {
      console.error('Error creating event:', err);
      setError('Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Create New Event</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="special">Special</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                >
                  <option value="draft">Draft</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Roster Settings
              </label>
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Max Performers per Team
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formData.rules?.maxPerformers}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      rules: {
                        ...prev.rules!,
                        maxPerformers: parseInt(e.target.value)
                      }
                    }))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Required Positions
                  </label>
                  <RosterPositionsManager
                    positions={formData.rules?.requiredPositions || {}}
                    onChange={handlePositionsChange}
                    maxPerformers={formData.rules?.maxPerformers || 5}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;