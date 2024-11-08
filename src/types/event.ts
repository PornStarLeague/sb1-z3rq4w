export type EventType = 'weekly' | 'monthly' | 'special';
export type EventStatus = 'draft' | 'upcoming' | 'active' | 'completed' | 'cancelled';

export interface EventPrize {
  rank: number;
  amount: number;
  type: 'token' | 'nft' | 'points';
  description: string;
}

export interface EventRules {
  maxEntries: number;
  entryFee: number;
  scoringSystem: {
    [key: string]: number;
  };
  restrictions?: string[];
  maxPerformers: number;
  requiredPositions: {
    [key: string]: number; // position: count
  };
}

export interface FantasyEvent {
  id?: string;
  title: string;
  description: string;
  type: EventType;
  status: EventStatus;
  startDate: string;
  endDate: string;
  prizes: EventPrize[];
  rules: EventRules;
  moviePool: string[]; // Array of movie IDs
  maxParticipants: number;
  currentParticipants: number;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

export interface EventRoster {
  eventId: string;
  userId: string;
  performers: {
    id: string;
    position: string;
  }[];
  score?: number;
  rank?: number;
  createdAt: string;
  updatedAt: string;
}