import React, { useState, useEffect } from 'react';
import { collection, doc, getDoc, updateDoc, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { EventRoster, FantasyEvent } from '../types/event';
import { Performer } from '../types/movie';

interface EventRosterManagerProps {
  event: FantasyEvent;
}

const EventRosterManager: React.FC<EventRosterManagerProps> = ({ event }) => {
  const { account } = useAuth();
  const [roster, setRoster] = useState<EventRoster | null>(null);
  const [availablePerformers, setAvailablePerformers] = useState<Performer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (account && event.id) {
      fetchRosterAndPerformers();
    }
  }, [account, event.id]);

  const fetchRosterAndPerformers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all performers
      const performersRef = collection(db, 'performers');
      const performersSnapshot = await getDocs(performersRef);
      const performers = performersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Performer[];
      setAvailablePerformers(performers);

      // Fetch existing roster
      if (account && event.id) {
        const rosterRef = doc(db, 'eventRosters', `${event.id}-${account}`);
        const rosterDoc = await getDoc(rosterRef);

        if (rosterDoc.exists()) {
          setRoster(rosterDoc.data() as EventRoster);
        } else {
          // Initialize new roster
          const newRoster: EventRoster = {
            eventId: event.id,
            userId: account,
            performers: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          setRoster(newRoster);
        }
      }
    } catch (err) {
      console.error('Error fetching roster data:', err);
      setError('Failed to load roster data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPerformer = async (performerId: string, position: string) => {
    if (!roster || !account) return;

    try {
      // Validate position requirements
      const positionCount = roster.performers.filter(p => p.position === position).length;
      const maxAllowed = event.rules.requiredPositions[position] || 0;

      if (positionCount >= maxAllowed) {
        setError(`Maximum ${position} positions (${maxAllowed}) reached`);
        return;
      }

      // Check if performer is already in roster
      if (roster.performers.some(p => p.id === performerId)) {
        setError('This performer is already in your roster');
        return;
      }

      // Update roster
      const updatedRoster: EventRoster = {
        ...roster,
        performers: [
          ...roster.performers,
          { id: performerId, position }
        ],
        updatedAt: new Date().toISOString()
      };

      const rosterRef = doc(db, 'eventRosters', `${event.id}-${account}`);
      await updateDoc(rosterRef, updatedRoster);
      setRoster(updatedRoster);
      setError(null);
    } catch (err) {
      console.error('Error updating roster:', err);
      setError('Failed to update roster');
    }
  };

  const handleRemovePerformer = async (performerId: string) => {
    if (!roster || !account) return;

    try {
      const updatedRoster: EventRoster = {
        ...roster,
        performers: roster.performers.filter(p => p.id !== performerId),
        updatedAt: new Date().toISOString()
      };

      const rosterRef = doc(db, 'eventRosters', `${event.id}-${account}`);
      await updateDoc(rosterRef, updatedRoster);
      setRoster(updatedRoster);
    } catch (err) {
      console.error('Error removing performer:', err);
      setError('Failed to remove performer');
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
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">Your Roster</h3>
        {!roster?.performers.length ? (
          <p className="text-gray-500">No performers added to your roster yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roster.performers.map((performer) => {
              const performerData = availablePerformers.find(p => p.id === performer.id);
              return performerData ? (
                <div key={performer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{performerData.name}</p>
                    <p className="text-sm text-gray-600">{performer.position}</p>
                  </div>
                  <button
                    onClick={() => handleRemovePerformer(performer.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ) : null;
            })}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">Available Performers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availablePerformers
            .filter(performer => !roster?.performers.some(p => p.id === performer.id))
            .map(performer => (
              <div key={performer.id} className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">{performer.name}</h4>
                <p className="text-sm text-gray-600 mb-4">{performer.gender}</p>
                <select
                  onChange={(e) => handleAddPerformer(performer.id!, e.target.value)}
                  className="w-full mt-2 rounded-md border-gray-300"
                  defaultValue=""
                >
                  <option value="" disabled>Select Position</option>
                  {Object.entries(event.rules.requiredPositions).map(([position, max]) => (
                    <option key={position} value={position}>
                      {position} ({max} max)
                    </option>
                  ))}
                </select>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default EventRosterManager;