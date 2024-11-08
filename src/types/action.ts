export interface ActionValue {
  id: string;
  name: string;
  value: number;
  description?: string;
}

export interface Position {
  id: string;
  name: string;
  description?: string;
}

export const PERFORMER_ACTIONS = [
  'Facial', 'Anal', 'DP', 'DPP', 'DAP', 'Pee', 'NonSex', 'LezOnly',
  'MastOnly', 'BJOnly', 'Swallow', 'Bald', 'Squirt', 'Creampie',
  'A2M', 'Fisting', 'Shaved', 'CumSwap', 'TP', 'TAP', 'TPP',
  'AnalToy', 'HJOnly', 'Footjob'
] as const;

export type PerformerAction = typeof PERFORMER_ACTIONS[number];

export const PERFORMER_POSITIONS = [
  'Lead',
  'Support',
  'Special',
  'Fetish',
  'NonSex',
  'MILF',
  'Analqueen',
  'Cam Girl',
  'Legend'
] as const;

export type PerformerPosition = typeof PERFORMER_POSITIONS[number];