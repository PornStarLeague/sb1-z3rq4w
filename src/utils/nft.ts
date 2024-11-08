import { ethers } from 'ethers';
import NFTContractABI from '../contracts/NFTContractABI.json';

export async function fetchNFTs(userAddress: string, contractAddress: string) {
  try {
    if (!window.ethereum) {
      throw new Error('Web3 provider not found');
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, NFTContractABI, provider);

    // Get token balance
    const balance = await contract.balanceOf(userAddress);
    const nfts = [];

    // Fetch each token
    for (let i = 0; i < balance.toNumber(); i++) {
      const tokenId = await contract.tokenOfOwnerByIndex(userAddress, i);
      const tokenURI = await contract.tokenURI(tokenId);
      const metadata = await fetch(tokenURI).then(res => res.json());

      nfts.push({
        id: tokenId.toString(),
        tokenId: tokenId.toString(),
        name: metadata.name,
        image: metadata.image,
        performer: metadata.attributes.find((attr: any) => attr.trait_type === 'Performer')?.value || 'Unknown',
        rarity: metadata.attributes.find((attr: any) => attr.trait_type === 'Rarity')?.value || 'Common',
        mintDate: metadata.attributes.find((attr: any) => attr.trait_type === 'Mint Date')?.value || new Date().toISOString(),
        network: 'Palm',
        contractAddress
      });
    }

    return nfts;
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    return [];
  }
}