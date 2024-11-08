import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

interface PerformerButtonProps {
  id: string;
  name: string;
  className?: string;
}

const PerformerButton: React.FC<PerformerButtonProps> = ({ id, name, className = '' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/performer/${id}`);
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${className}`}
    >
      <User className="h-4 w-4 mr-2" />
      {name}
    </button>
  );
};

export default PerformerButton;