export const PERFORMER_POSITIONS = [
  'Lead',
  'Support',
  'Special',
  'Fetish',
  'NonSex',
  'Analqueen',
  'Cam Girl',
  'Legend',
  'MILF'
] as const;

export type PerformerPosition = typeof PERFORMER_POSITIONS[number];

// Position categories for organization
export const POSITION_CATEGORIES = {
  MAIN: ['Lead', 'Support', 'Special'] as const,
  SPECIALTY: ['Fetish', 'NonSex', 'MILF'] as const,
  PREMIUM: ['Analqueen', 'Cam Girl', 'Legend'] as const
} as const;