import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Save, Upload, Calendar } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { PERFORMER_POSITIONS, PerformerPosition } from '../constants/positions';
import PositionSelector from '../components/PerformerForm/PositionSelector';

interface PerformerData {
  name: string;
  gender: 'Male' | 'Female' | '';
  bio: string;
  positions: PerformerPosition[];
  imageUrl?: string;
  dateOfBirth: string;
}

const PerformerSubmissionPage: React.FC = () => {
  const navigate = useNavigate();
  const { account } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [performerData, setPerformerData] = useState<PerformerData>({
    name: '',
    gender: '',
    bio: '',
    positions: [],
    dateOfBirth: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPerformerData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handlePositionToggle = (position: PerformerPosition) => {
    setPerformerData(prev => ({
      ...prev,
      positions: prev.positions.includes(position)
        ? prev.positions.filter(p => p !== position)
        : [...prev.positions, position]
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
    if (!performerData.dateOfBirth) {
      setError('Date of Birth is required');
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
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <div className="mt-1 flex items-center">
                <Calendar className="text-gray-400 mr-2" size={20} />
                <input
                  type="date"
                  name="dateOfBirth"
                  value={performerData.dateOfBirth}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Profile Image</label>
              <div className="mt-1 flex items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
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

          <PositionSelector
            selectedPositions={performerData.positions}
            onToggle={handlePositionToggle}
          />

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