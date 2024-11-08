import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Film, Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import { collection, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { MovieData, MoviePerformer, PerformerTags } from '../types/movie';
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

const MovieScenesPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { movieId, movieTitle } = location.state || {};

  const [scenes, setScenes] = useState<Scene[]>([
    { sceneNumber: '', description: '', performers: [] }
  ]);
  const [moviePerformers, setMoviePerformers] = useState<MoviePerformer[]>([]);
  const [expandedPerformers, setExpandedPerformers] = useState<{[key: string]: boolean}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMoviePerformers = async () => {
      if (!movieId) return;

      try {
        const movieRef = doc(db, 'movies', movieId);
        const movieDoc = await getDoc(movieRef);
        
        if (movieDoc.exists()) {
          const movieData = movieDoc.data() as MovieData;
          setMoviePerformers(movieData.performers || []);
        }
      } catch (error) {
        console.error('Error fetching movie performers:', error);
        setError('Failed to load movie performers');
      }
    };

    fetchMoviePerformers();
  }, [movieId]);

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
    setScenes([...scenes, { sceneNumber: '', description: '', performers: [] }]);
  };

  const removeScene = (index: number) => {
    if (scenes.length > 1) {
      setScenes(scenes.filter((_, i) => i !== index));
    }
  };

  const validateScenes = () => {
    const validScenes = scenes.filter(scene => 
      scene.sceneNumber.trim() &&
      scene.description.trim() &&
      scene.performers.length > 0
    );

    if (validScenes.length === 0) {
      setError('Please add at least one complete scene with all fields filled and at least one performer selected');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!movieId || !movieTitle) {
      setError('Invalid movie data. Please submit movie details first.');
      return;
    }

    if (!validateScenes()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const movieRef = doc(db, 'movies', movieId);
      const validScenes = scenes.filter(scene => 
        scene.sceneNumber.trim() &&
        scene.description.trim() &&
        scene.performers.length > 0
      );

      await updateDoc(movieRef, {
        scenes: arrayUnion(...validScenes),
        updatedAt: new Date()
      });

      navigate('/oracle', { 
        replace: true,
        state: { success: 'Scenes submitted successfully!' }
      });
    } catch (err) {
      console.error('Error submitting scenes:', err);
      setError('Failed to submit scenes. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!movieId || !movieTitle) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">Error: No movie data found. Please submit movie details first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
        Add Scenes for {movieTitle}
      </h1>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {scenes.map((scene, sceneIndex) => (
            <div key={sceneIndex} className="space-y-4 p-4 border border-gray-200 rounded-lg">
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
                  {moviePerformers.map((performer) => (
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
                  {moviePerformers.length === 0 && (
                    <p className="text-gray-500 text-sm">No performers found for this movie.</p>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addScene}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors flex items-center justify-center"
          >
            <Plus size={20} className="mr-2" />
            Add Another Scene
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Film size={20} className="mr-2" />
            {isSubmitting ? 'Submitting...' : 'Submit Scenes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MovieScenesPage;