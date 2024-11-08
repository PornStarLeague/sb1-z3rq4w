export interface Performer {
  id?: string;
  name: string;
  gender: 'Male' | 'Female' | '';
  movieCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FilmographyEntry {
  movieId: string;
  title: string;
  studio: string;
  releaseDate: string;
  addedAt: Date;
}

export interface PerformerTags {
  Facial?: boolean;
  Anal?: boolean;
  DP?: boolean;
  DPP?: boolean;
  DAP?: boolean;
  Pee?: boolean;
  NonSex?: boolean;
  LezOnly?: boolean;
  MastOnly?: boolean;
  BJOnly?: boolean;
  Swallow?: boolean;
  Bald?: boolean;
  Squirt?: boolean;
  Creampie?: boolean;
  A2M?: boolean;
  Fisting?: boolean;
  Shaved?: boolean;
  CumSwap?: boolean;
  TP?: boolean;
  TAP?: boolean;
  TPP?: boolean;
  AnalToy?: boolean;
  HJOnly?: boolean;
  Footjob?: boolean;
}

export interface MoviePerformer extends Performer {
  tags?: PerformerTags;
}

export interface MovieData {
  id?: string;
  title: string;
  studio: string;
  releaseDate: string;
  performers: MoviePerformer[];
  description?: string;
  rating?: number;
  genre?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  submittedBy?: string;
}