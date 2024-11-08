export interface NFT {
  id: string;
  tokenId: string;
  name: string;
  image: string;
  performer: string;
  rarity: string;
  mintDate: string;
  network: string;
  contractAddress: string;
  cost: number;
  available?: boolean;
  ownerId?: string | null;
  performerId?: string;
}