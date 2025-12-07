import { RankedAdopteeMatch } from './schema';

export interface ApplicationState {
  appId: string;
  form: Partial<FormState>;
  matches: RankedAdopteeMatch[] | null;
  selectedMatch: string | null;
  stillInCorrespondence: boolean;
  rankedMatches: string[] | null;
}

export interface FormState {
  bio: string;
  genderPreference: 'male' | 'female' | 'no_preference';
  whyAdopting?: string;
  whyEnded?: string;
  offensePreference: ('Option 1' | 'Option 2' | 'Option 3' | 'None')[];
}

export interface EmailPasswordCredentials {
  email: string;
  password: string;
}

export interface OnboardingInfo {
  firstName: string;
  lastName: string;
  dob: Date; // date of birth
  pronouns: string;
  state: string;
  isVeteran: boolean;
}
