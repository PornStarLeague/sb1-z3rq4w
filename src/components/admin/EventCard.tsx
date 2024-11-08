import React, { useState } from 'react';
import { Calendar, Users, Trophy, Clock, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { FantasyEvent } from '../../types/event';
import EditEventModal from './EditEventModal';
import DeleteEventModal from './DeleteEventModal';

interface EventCardProps {
  event: FantasyEvent;
  onUpdate: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onUpdate }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MoreVertical size={20} />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowEditModal(true);
                  }}
                  className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  <Edit2 size={16} className="mr-2" />
                  Edit Event
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowDeleteModal(true);
                  }}
                  className="flex items-center w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete Event
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <Calendar size={16} className="mr-2" />
            <span>{new Date(event.startDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock size={16} className="mr-2" />
            <span>{new Date(event.endDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Users size={16} className="mr-2" />
            <span>{event.currentParticipants} / {event.maxParticipants} participants</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Trophy size={16} className="mr-2" />
            <span>{event.prizes.length} prizes</span>
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditEventModal
          event={event}
          onClose={() => setShowEditModal(false)}
          onUpdate={(updatedEvent) => {
            onUpdate();
            setShowEditModal(false);
          }}
        />
      )}

      {showDeleteModal && (
        <DeleteEventModal
          event={event}
          onClose={() => setShowDeleteModal(false)}
          onDelete={() => {
            onUpdate();
            setShowDeleteModal(false);
          }}
        />
      )}
    </div>
  );
};

export default EventCard;