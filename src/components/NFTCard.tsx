import React from 'react';
import { ExternalLink, Star, Calendar, User } from 'lucide-react';

interface NFTCardProps {
  tokenId: string;
  name: string;
  image: string;
  performer: string;
  rarity: string;
  mintDate: string;
  contractAddress: string;
}

const NFTCard: React.FC<NFTCardProps> = ({
  tokenId,
  name,
  image,
  performer,
  rarity,
  mintDate,
  contractAddress
}) => {
  const formatAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getExplorerUrl = (contractAddress: string, tokenId: string): string => {
    return `https://explorer.palm.io/token/${contractAddress}/instance/${tokenId}`;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Epic':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Rare':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = 'https://via.placeholder.com/300?text=NFT+Image+Not+Available';
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-square overflow-hidden relative">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={handleImageError}
        />
        <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold ${getRarityColor(rarity)} border`}>
          {rarity}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-1">{name}</h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-600">
            <User className="w-4 h-4 mr-2" />
            <span className="line-clamp-1">{performer}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <Star className="w-4 h-4 mr-2" />
            <span>#{tokenId}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{new Date(mintDate).toLocaleDateString()}</span>
          </div>

          <a
            href={getExplorerUrl(contractAddress, tokenId)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mt-2"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            View on Explorer
          </a>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;