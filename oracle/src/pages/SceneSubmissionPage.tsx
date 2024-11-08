import React, { useState } from 'react';
import { Video } from 'lucide-react';

const SceneSubmissionPage: React.FC = () => {
  const [sceneData, setSceneData] = useState({
    movieTitle: '',
    sceneNumber: '',
    startTime: '',
    endTime: '',
    description: '',
    characters: '',
    actions: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSceneData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting scene data:', sceneData);
    alert('Scene submitted successfully!');
    setSceneData({
      movieTitle: '',
      sceneNumber: '',
      startTime: '',
      endTime: '',
      description: '',
      characters: '',
      actions: ''
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-purple-600">Submit a Scene</h1>
      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="movieTitle" className="block text-sm font-medium text-gray-700">Movie Title</label>
            <input
              type="text"
              id="movieTitle"
              name="movieTitle"
              value={sceneData.movieTitle}
              onChange={handleInputChange}
              required
              className="input"
            />
          </div>
          <div>
            <label htmlFor="sceneNumber" className="block text-sm font-medium text-gray-700">Scene Number</label>
            <input
              type="number"
              id="sceneNumber"
              name="sceneNumber"
              value={sceneData.sceneNumber}
              onChange={handleInputChange}
              required
              className="input"
            />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={sceneData.startTime}
                onChange={handleInputChange}
                required
                className="input"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={sceneData.endTime}
                onChange={handleInputChange}
                required
                className="input"
              />
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Scene Description</label>
            <textarea
              id="description"
              name="description"
              value={sceneData.description}
              onChange={handleInputChange}
              rows={3}
              className="input"
            ></textarea>
          </div>
          <div>
            <label htmlFor="characters" className="block text-sm font-medium text-gray-700">Characters in Scene</label>
            <input
              type="text"
              id="characters"
              name="characters"
              value={sceneData.characters}
              onChange={handleInputChange}
              placeholder="Separate multiple characters with commas"
              className="input"
            />
          </div>
          <div>
            <label htmlFor="actions" className="block text-sm font-medium text-gray-700">Key Actions</label>
            <textarea
              id="actions"
              name="actions"
              value={sceneData.actions}
              onChange={handleInputChange}
              rows={3}
              placeholder="Describe important actions or events in the scene"
              className="input"
            ></textarea>
          </div>
          <div>
            <button type="submit" className="btn btn-secondary w-full flex items-center justify-center">
              <Video className="mr-2" size={18} />
              Submit Scene
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SceneSubmissionPage;