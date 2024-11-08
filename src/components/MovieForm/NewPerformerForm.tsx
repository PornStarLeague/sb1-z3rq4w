import React, { useState } from 'react';
import { X } from 'lucide-react';

interface NewPerformerFormProps {
  initialName?: string;
  onSubmit: (name: string, gender: string) => void;
  onCancel: () => void;
}

const NewPerformerForm: React.FC<NewPerformerFormProps> = ({ 
  initialName = '', 
  onSubmit, 
  onCancel 
}) => {
  const [name, setName] = useState(initialName);
  const [gender, setGender] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    setError(null);

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (!gender) {
      setError('Gender is required');
      return;
    }

    onSubmit(name.trim(), gender);
    setName('');
    setGender('');
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Add New Performer</h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-500"
        >
          <X size={20} />
        </button>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="performerName" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="performerName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={gender === 'Male'}
                onChange={(e) => setGender(e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2">Male</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={gender === 'Female'}
                onChange={(e) => setGender(e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2">Female</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Add Performer
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewPerformerForm;