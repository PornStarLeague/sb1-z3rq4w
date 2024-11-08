import React, { useState, useEffect } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { PERFORMER_ACTIONS } from '../../types/action';

interface ScenePointValue {
  id: string;
  name: string;
  points: number;
  description: string;
}

const ScenePointsPage: React.FC = () => {
  const [pointValues, setPointValues] = useState<ScenePointValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchPointValues();
  }, []);

  const fetchPointValues = async () => {
    try {
      setLoading(true);
      const pointsRef = collection(db, 'scenePoints');
      const snapshot = await getDocs(pointsRef);
      
      const existingPoints = new Map(
        snapshot.docs.map(doc => [doc.id, { id: doc.id, ...doc.data() }])
      );

      // Initialize or update points for all actions
      const updatedPoints = PERFORMER_ACTIONS.map(action => {
        const existingPoint = existingPoints.get(action.toLowerCase());
        return existingPoint || {
          id: action.toLowerCase(),
          name: action,
          points: 10, // Default value
          description: ''
        };
      });

      setPointValues(updatedPoints);
    } catch (err) {
      console.error('Error fetching point values:', err);
      setError('Failed to load point values');
    } finally {
      setLoading(false);
    }
  };

  const handlePointChange = (id: string, points: number) => {
    setPointValues(prev => prev.map(value => 
      value.id === id ? { ...value, points } : value
    ));
  };

  const handleDescriptionChange = (id: string, description: string) => {
    setPointValues(prev => prev.map(value => 
      value.id === id ? { ...value, description } : value
    ));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Validate points
      const invalidPoints = pointValues.find(value => value.points < 0);
      if (invalidPoints) {
        setError('Points cannot be negative');
        return;
      }

      // Save all point values
      for (const value of pointValues) {
        const pointRef = doc(db, 'scenePoints', value.id);
        await setDoc(pointRef, {
          name: value.name,
          points: value.points,
          description: value.description,
          updatedAt: new Date().toISOString()
        });
      }

      setSuccess('Point values saved successfully!');
    } catch (err) {
      console.error('Error saving point values:', err);
      setError('Failed to save point values');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Scene Point Values</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Save size={18} className="mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {error && (
        <div className="mb-4 flex items-center bg-red-50 border-l-4 border-red-500 p-4">
          <AlertCircle className="text-red-500 mr-2" size={20} />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4">
          <p className="text-green-700">{success}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid gap-6">
          {pointValues.map((value) => (
            <div key={value.id} className="border-b pb-4 last:border-b-0 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">{value.name}</h3>
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600">Points:</label>
                  <input
                    type="number"
                    min="0"
                    value={value.points}
                    onChange={(e) => handlePointChange(value.id, parseInt(e.target.value) || 0)}
                    className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Description:</label>
                <input
                  type="text"
                  value={value.description}
                  onChange={(e) => handleDescriptionChange(value.id, e.target.value)}
                  placeholder="Add a description for this action..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScenePointsPage;