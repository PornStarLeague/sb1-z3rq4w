import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Film, Save, Trash2, AlertCircle, Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { MovieData, MoviePerformer, PerformerTags } from '../types/movie';
import { useAuth } from '../context/AuthContext';
import PerformerTagsSelect from '../components/MovieForm/PerformerTags';
import PerformerButton from '../components/PerformerButton';

interface ScenePerformer {
  id: string;
  name: string;
  tags: PerformerTags;
}

interface Scene {
  sceneNumber: string;
  description: string;
  performers: ScenePerformer[];
}

const EditMovieDetailsPage: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const { account } = useAuth();
  
  const [movieData, setMovieData] = useState<MovieData | null>(null);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [expandedPerformers, setExpandedPerformers] = useState<{[key: string]: boolean}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!movieId) return;

      try {
        const movieRef = doc(db, 'movies', movieId);
        const movieDoc = await getDoc(movieRef);

        if (!movieDoc.exists()) {
          setError('Movie not found');
          return;
        }

        const data = movieDoc.data() as MovieData;
        setMovieData({ id: movieDoc.id, ...data });
        setScenes(data.scenes || []);
      } catch (err) {
        console.error('Error fetching movie:', err);
        setError('Failed to load movie details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovie();
  }, [movieId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMovieData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSceneChange = (index: number, field: keyof Scene, value: any) => {
    const updatedScenes = scenes.map((scene, i) => 
      i === index ? { ...scene, [field]: value } : scene
    );
    setScenes(updatedScenes);
  };

  const togglePerformer = (sceneIndex: number, performer: MoviePerformer) => {
    const scene = scenes[sceneIndex];
    const isSelected = scene.performers.some(p => p.id === performer.id);
    
    let updatedPerformers;
    if (isSelected) {
      updatedPerformers = scene.performers.filter(p => p.id !== performer.id);
    } else {
      updatedPerformers = [...scene.performers, { 
        id: performer.id!,
        name: performer.name,
        tags: {}
      }];
    }
    
    handleSceneChange(sceneIndex, 'performers', updatedPerformers);
  };

  const handlePerformerTags = (sceneIndex: number, performerId: string, tags: PerformerTags) => {
    const updatedScenes = scenes.map((scene, i) => {
      if (i === sceneIndex) {
        return {
          ...scene,
          performers: scene.performers.map(p => 
            p.id === performerId ? { ...p, tags } : p
          )
        };
      }
      return scene;
    });
    setScenes(updatedScenes);
  };

  const togglePerformerExpanded = (sceneIndex: number, performerId: string) => {
    const key = `${sceneIndex}-${performerId}`;
    setExpandedPerformers(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const addScene = () => {
    setScenes([...scenes, {
      sceneNumber: '',
      description: '',
      performers: []
    }]);
  };

  const removeScene = (index: number) => {
    if (scenes.length > 1) {
      setScenes(scenes.filter((_, i) => i !== index));
    }
  };

  const handleSave = async () => {
    if (!movieId || !movieData) return;

    setIsSaving(true);
    setError(null);

    try {
      const movieRef = doc(db, 'movies', movieId);
      await updateDoc(movieRef, {
        ...movieData,
        scenes,
        updatedAt: new Date(),
        updatedBy: account
      });

      navigate('/oracle/edit-movie', { 
        state: { success: 'Movie updated successfully!' }
      });
    } catch (err) {
      console.error('Error updating movie:', err);
      setError('Failed to update movie');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!movieId) return;

    setIsDeleting(true);
    setError(null);

    try {
      await deleteDoc(doc(db, 'movies', movieId));
      navigate('/oracle/edit-movie', {
        state: { success: 'Movie deleted successfully!' }
      });
    } catch (err) {
      console.error('Error deleting movie:', err);
      setError('Failed to delete movie');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!movieData) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">Movie not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
        Edit Movie: {movieData.title}
      </h1>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Movie Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={movieData.title}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              required
            />
          </div>

          <div>
            <label htmlFor="studio" className="block text-sm font-medium text-gray-700">
              Studio
            </label>
            <input
              type="text"
              id="studio"
              name="studio"
              value={movieData.studio}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              required
            />
          </div>

          <div>
            <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-700">
              Release Date
            </label>
            <input
              type="date"
              id="releaseDate"
              name="releaseDate"
              value={movieData.releaseDate}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              required
            />
          </div>

          <div className="border-t pt-6">
            <h2 className="text-2xl font-bold mb-6">Scenes</h2>
            {scenes.map((scene, sceneIndex) => (
              <div key={sceneIndex} className="space-y-4 p-4 border border-gray-200 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium">Scene {sceneIndex + 1}</h3>
                  {scenes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeScene(sceneIndex)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scene Number
                  </label>
                  <input
                    type="text"
                    value={scene.sceneNumber}
                    onChange={(e) => handleSceneChange(sceneIndex, 'sceneNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 1A, 2B"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={scene.description}
                    onChange={(e) => handleSceneChange(sceneIndex, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Describe what happens in this scene"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Performers in Scene
                  </label>
                  <div className="space-y-2 bg-gray-50 p-3 rounded-md">
                    {movieData.performers.map((performer) => (
                      <div key={performer.id} className="border border-gray-200 rounded-md bg-white">
                        <div className="p-3 flex items-center justify-between">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={scene.performers.some(p => p.id === performer.id)}
                              onChange={() => togglePerformer(sceneIndex, performer)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span>{performer.name}</span>
                            <span className="text-sm text-gray-500">({performer.gender})</span>
                          </label>
                          <PerformerButton id={performer.id!} name="View Profile" />
                        </div>

                        {scene.performers.some(p => p.id === performer.id) && (
                          <div className="border-t border-gray-200 p-3">
                            <div className="mb-2">
                              <button
                                type="button"
                                onClick={() => togglePerformerExpanded(sceneIndex, performer.id!)}
                                className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                              >
                                {expandedPerformers[`${sceneIndex}-${performer.id}`] ? (
                                  <ChevronUp size={16} className="mr-1" />
                                ) : (
                                  <ChevronDown size={16} className="mr-1" />
                                )}
                                Scene Tags
                              </button>
                            </div>

                            {expandedPerformers[`${sceneIndex}-${performer.id}`] && (
                              <PerformerTagsSelect
                                tags={scene.performers.find(p => p.id === performer.id)?.tags || {}}
                                onChange={(tags) => handlePerformerTags(sceneIndex, performer.id!, tags)}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addScene}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors flex items-center justify-center mt-4"
            >
              <Plus size={20} className="mr-2" />
              Add Another Scene
            </button>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center disabled:opacity-50"
            >
              <Save className="mr-2" size={18} />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>

            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
              className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-300 flex items-center justify-center disabled:opacity-50"
            >
              <Trash2 className="mr-2" size={18} />
              Delete
            </button>
          </div>
        </form>

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center text-red-600 mb-4">
                <AlertCircle className="mr-2" size={24} />
                <h3 className="text-lg font-bold">Confirm Delete</h3>
              </div>
              <p className="mb-6">
                Are you sure you want to delete "{movieData.title}"? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-300"
                >
                  Delete Movie
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditMovieDetailsPage;