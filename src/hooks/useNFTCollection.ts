import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getNFTsByOwner } from '../services/nft';
import { NFT } from '../types/nft';

export const useNFTCollection = () => {
  const { account } = useAuth();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNFTs = useCallback(async () => {
    if (!account) {
      setNfts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const userNFTs = await getNFTsByOwner(account);
      setNfts(userNFTs);
    } catch (err) {
      console.error('Error in useNFTCollection:', err);
      setError('Unable to load NFTs. Please try again later.');
      setNfts([]);
    } finally {
      setLoading(false);
    }
  }, [account]);

  useEffect(() => {
    fetchNFTs();
  }, [fetchNFTs]);

  const retry = () => {
    fetchNFTs();
  };

  return { nfts, loading, error, retry };
};