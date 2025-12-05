import { Database } from './database.types';

export type Profile = Database['public']['Tables']['adopter_profiles']['Row'];

export type AdopterApplication =
  Database['public']['Tables']['adopter_applications_dummy']['Row'];
