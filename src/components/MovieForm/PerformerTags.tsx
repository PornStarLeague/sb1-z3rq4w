import React from 'react';
import { PerformerTags } from '../../types/movie';

interface PerformerTagsProps {
  tags: PerformerTags;
  onChange: (tags: PerformerTags) => void;
}

const TAGS = [
  'Facial', 'Anal', 'DP', 'DPP', 'DAP', 'Pee', 'NonSex', 'LezOnly',
  'MastOnly', 'BJOnly', 'Swallow', 'Bald', 'Squirt', 'Creampie',
  'A2M', 'Fisting', 'Shaved', 'CumSwap', 'TP', 'TAP', 'TPP',
  'AnalToy', 'HJOnly', 'Footjob'
];

const PerformerTagsSelect: React.FC<PerformerTagsProps> = ({ tags, onChange }) => {
  const handleTagChange = (tag: keyof PerformerTags) => {
    onChange({
      ...tags,
      [tag]: !tags[tag]
    });
  };

  return (
    <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
      {TAGS.map((tag) => (
        <label
          key={tag}
          className="flex items-center space-x-2 text-sm"
        >
          <input
            type="checkbox"
            checked={tags[tag as keyof PerformerTags] || false}
            onChange={() => handleTagChange(tag as keyof PerformerTags)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span>{tag}</span>
        </label>
      ))}
    </div>
  );
};

export default PerformerTagsSelect;