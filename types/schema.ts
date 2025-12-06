import { Database } from './database.types';

export type PublicTables = Database['public']['Tables'];
export type PublicTable<T extends keyof PublicTables> = PublicTables[T]['Row'];

export type Profile = PublicTable<'adopter_profiles'>;

// TODO: update table name when no longer in testing
export type AdopterApplication = PublicTable<'adopter_applications_dummy'>;
