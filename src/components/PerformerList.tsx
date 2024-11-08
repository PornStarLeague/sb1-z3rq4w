import React from 'react';
import PerformerButton from './PerformerButton';
import { Performer } from '../types/movie';

interface PerformerListProps {
  performers: Performer[];
  className?: string;
}

const PerformerList: React.FC<PerformerListProps> = ({ performers, className = '' }) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {performers.map((performer, index) => (
        <PerformerButton
          key={performer.id || index}
          id={performer.id || ''}
          name={performer.name}
        />
      ))}
    </div>
  );
};

export default PerformerList;