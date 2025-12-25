import { Database } from './database.types';

// utility types
export type PublicTables = Database['public']['Tables'];
export type PublicTable<T extends keyof PublicTables> = PublicTables[T]['Row'];
export type PublicFunctions = Database['public']['Functions'];

export type Profile = PublicTable<'adopter_profiles'>;

// TODO: update table name when no longer in testing
export type AdopterApplication = PublicTable<'adopter_applications_dummy'>;

export type AdopteeMatch =
  PublicFunctions['find_top_k_filtered']['Returns'][number];

export type RankedAdopteeMatch = Pick<
  AdopteeMatch,
  'id' | 'age' | 'bio' | 'first_name' | 'state' | 'gender'
>;

export type AdopterApplicationUpdate = Omit<
  Partial<AdopterApplication>,
  'adopter_uuid' | 'app_uuid'
>;
