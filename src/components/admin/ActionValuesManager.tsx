import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { ActionValue, PERFORMER_ACTIONS } from '../../types/action';
import { Slider, Save } from 'lucide-react';

const ActionValuesManager: React.FC = () => {
  const [actionValues, setActionValues] = useState<ActionValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchActionValues();
  }, []);

  const fetchActionValues = async () => {
    try {
      const valuesRef = collection(db, 'actionValues');
      const snapshot = await getDocs(valuesRef);
      const values = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ActionValue[];

      // Initialize any missing actions with default values
      const existingActions = new Set(values.map(v => v.name));
      const missingActions = PERFORMER_ACTIONS.filter(action => !existingActions.has(action));
      
      const newValues = [
        ...values,
        ...missingActions.map(action => ({
          id: action.toLowerCase(),
          name: action,
          value: 5, // Default value
          description: ''
        }))
      ];

      setActionValues(newValues);
    } catch (err) {
      console.error('Error fetching action values:', err);
      setError('Failed to load action values');
    } finally {
      setLoading(false);
    }
  };

  const handleValueChange = (actionId: string, value: number) => {
    setActionValues(prev => prev.map(action => 
      action.id === actionId ? { ...action, value } : action
    ));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const batch = db.batch();
      
      actionValues.forEach(action => {
        const docRef = doc(db, 'actionValues', action.id);
        batch.set(docRef, action);
      });

      await batch.commit();
    } catch (err) {
      console.error('Error saving action values:', err);
      setError('Failed to save action values');
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Action Values</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Save size={18} className="mr-2" />
          {saving ? 'Saving...' : 'Save Values'}
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {actionValues.map(action => (
          <div key={action.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="font-medium">{action.name}</label>
              <span className="text-blue-600 font-bold">{action.value}</span>
            </div>
            <div className="flex items-center gap-4">
              <Slider className="text-blue-600" size={16} />
              <input
                type="range"
                min="1"
                max="10"
                value={action.value}
                onChange={(e) => handleValueChange(action.id, parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActionValuesManager;