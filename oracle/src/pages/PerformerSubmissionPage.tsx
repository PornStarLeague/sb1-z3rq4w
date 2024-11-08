import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Save, Calendar, MapPin, Ruler, Activity } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { PERFORMER_POSITIONS, PerformerPosition } from '../types/action';

interface PerformerData {
  name: string;
  gender: 'Male' | 'Female' | '';
  birthYear?: number;
  birthPlace?: string;
  height?: string;
  measurements?: string;
  bio: string;
  positions: PerformerPosition[];
  active: boolean;
  startYear?: number;
  endYear?: number;
  tattoos?: string[];
  piercings?: string[];
  hairColor?: string;
  eyeColor?: string;
  ethnicity?: string;
}

const PerformerSubmissionPage: React.FC = () => {
  const navigate = useNavigate();
  const { account } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [performerData, setPerformerData] = useState<PerformerData>({
    name: '',
    gender: '',
    bio: '',
    positions: [],
    active: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPerformerData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePositionToggle = (position: PerformerPosition) => {
    setPerformerData(prev => ({
      ...prev,
      positions: prev.positions.includes(position)
        ? prev.positions.filter(p => p !== position)
        : [...prev.positions, position]
    }));
  };

  const handleArrayInput = (e: React.KeyboardEvent<HTMLInputElement>, field: 'tattoos' | 'piercings') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = e.currentTarget.value.trim();
      if (value) {
        setPerformerData(prev => ({
          ...prev,
          [field]: [...(prev[field] || []), value]
        }));
        e.currentTarget.value = '';
      }
    }
  };

  const removeArrayItem = (field: 'tattoos' | 'piercings', index: number) => {
    setPerformerData(prev => ({
      ...prev,
      [field]: prev[field]?.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    if (!performerData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!performerData.gender) {
      setError('Gender is required');
      return false;
    }
    if (performerData.positions.length === 0) {
      setError('At least one position must be selected');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!account) {
      setError('Please connect your wallet to submit performers');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const performersRef = collection(db, 'performers');
      await addDoc(performersRef, {
        ...performerData,
        submittedBy: account,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        movieCount: 0
      });

      navigate('/oracle', {
        state: { success: 'Performer submitted successfully!' }
      });
    } catch (err) {
      console.error('Error submitting performer:', err);
      setError('Failed to submit performer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
        Submit New Performer
      </h1>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <User className="mr-2" size={20} />
              Basic Information
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={performerData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                name="gender"
                value={performerData.gender}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
              >
                <option value="">Select Gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                name="bio"
                value={performerData.bio}
                onChange={handleInputChange}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
          </div>

          {/* Physical Characteristics */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Ruler className="mr-2" size={20} />
              Physical Characteristics
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Height</label>
                <input
                  type="text"
                  name="height"
                  value={performerData.height || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., 5'6\""
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Measurements</label>
                <input
                  type="text"
                  name="measurements"
                  value={performerData.measurements || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., 34-24-36"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Hair Color</label>
                <input
                  type="text"
                  name="hairColor"
                  value={performerData.hairColor || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Eye Color</label>
                <input
                  type="text"
                  name="eyeColor"
                  value={performerData.eyeColor || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Ethnicity</label>
              <input
                type="text"
                name="ethnicity"
                value={performerData.ethnicity || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
          </div>

          {/* Career Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Calendar className="mr-2" size={20} />
              Career Information
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Year</label>
                <input
                  type="number"
                  name="startYear"
                  value={performerData.startYear || ''}
                  onChange={handleInputChange}
                  min="1960"
                  max={new Date().getFullYear()}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">End Year</label>
                <input
                  type="number"
                  name="endYear"
                  value={performerData.endYear || ''}
                  onChange={handleInputChange}
                  min="1960"
                  max={new Date().getFullYear()}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="active"
                    checked={performerData.active}
                    onChange={(e) => setPerformerData(prev => ({
                      ...prev,
                      active: e.target.checked
                    }))}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2">Currently Active</span>
                </label>
              </div>
            </div>
          </div>

          {/* Positions */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Activity className="mr-2" size={20} />
              Positions
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {PERFORMER_POSITIONS.map(position => (
                <label key={position} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={performerData.positions.includes(position)}
                    onChange={() => handlePositionToggle(position)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2">{position}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Additional Details</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700">Tattoos</label>
              <input
                type="text"
                placeholder="Press Enter to add"
                onKeyDown={(e) => handleArrayInput(e, 'tattoos')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {performerData.tattoos?.map((tattoo, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tattoo}
                    <button
                      type="button"
                      onClick={() => removeArrayItem('tattoos', index)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Piercings</label>
              <input
                type="text"
                placeholder="Press Enter to add"
                onKeyDown={(e) => handleArrayInput(e, 'piercings')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {performerData.piercings?.map((piercing, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                  >
                    {piercing}
                    <button
                      type="button"
                      onClick={() => removeArrayItem('piercings', index)}
                      className="ml-1 text-purple-600 hover:text-purple-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center disabled:opacity-50"
          >
            <Save className="mr-2" size={18} />
            {isSubmitting ? 'Submitting...' : 'Submit Performer'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PerformerSubmissionPage;