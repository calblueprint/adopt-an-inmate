import { getApplicationWithAdoptees } from '@/actions/applications/getApplicationWithAdoptees';
import { Database } from './database.types';

// utility types
export type PublicTables = Database['public']['Tables'];
export type PublicTable<T extends keyof PublicTables> = PublicTables[T]['Row'];
export type PublicFunctions = Database['public']['Functions'];

// types derived from database-generated types
export type Profile = PublicTable<'adopter_profiles'>;

// TODO: update table name when no longer in testing
export type AdopterApplication = PublicTable<'adopter_applications_dummy'>;

export type ProfileAndApplication =
  PublicFunctions['get_user_and_application']['Returns'][number];

export type AdopteeMatch =
  PublicFunctions['find_top_k_filtered']['Returns'][number];

export type RankedAdopteeMatch = Pick<
  AdopteeMatch,
  'id' | 'age' | 'bio' | 'first_name' | 'state' | 'gender'
>;

export type Adoptee = PublicTables['adoptee_vector_test']['Row'];
export type AdopteeWithFacility =
  PublicFunctions['get_adoptee_with_facility']['Returns'][number];

export type AdopterApplicationUpdate = Omit<
  Partial<AdopterApplication>,
  'adopter_uuid' | 'app_uuid'
>;

export type ApplicationStatusEnum = Database['public']['Enums']['status_vals'];

// types derived from database query functions

export type ApplicationWithAdoptees = Awaited<
  ReturnType<typeof getApplicationWithAdoptees>
>['data'];
