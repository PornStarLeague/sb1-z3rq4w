export interface UserProfile {
  id: string;
  address: string;
  points: number;
  moviesSubmitted: number;
  scenesSubmitted: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStats {
  totalPoints: number;
  moviesSubmitted: number;
  scenesSubmitted: number;
  rank?: number;
}