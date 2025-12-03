import { Database } from './database.types';

export type Profile = Database['public']['Tables']['adopter_profiles']['Row'];

export type AdopteeMatch =
  Database['public']['Functions']['find_top_k_filtered']['Returns'][number];

export type RankedAdopteeMatch = AdopteeMatch & { rank: number | null };
