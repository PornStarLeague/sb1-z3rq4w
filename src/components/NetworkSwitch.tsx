import React from 'react';
import { Network } from 'lucide-react';
import { switchToPalmNetwork } from '../utils/network';

interface NetworkSwitchProps {
  onSwitch?: () => void;
}

const NetworkSwitch: React.FC<NetworkSwitchProps> = ({ onSwitch }) => {
  const handleSwitch = async () => {
    try {
      const success = await switchToPalmNetwork();
      if (success && onSwitch) {
        onSwitch();
      }
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  };

  return (
    <button
      onClick={handleSwitch}
      className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition-colors"
    >
      <Network size={20} />
      <span>Switch to Palm Network</span>
    </button>
  );
};

export default NetworkSwitch;