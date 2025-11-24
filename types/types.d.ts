export interface ApplicationState {
  appId: string;
  form: Partial<FormState>;
  matches: AdopteeMatch[] | null;
  selectedMatch: string | null;
  stillInCorrespondence: boolean;
}

export interface AdopteeMatch {
  id: string;
  first_name: string;
  dob: Date;
  state: string;
  gender: string;
  bio: string;
  rank: number | null;
}

export interface FormState {
  bio: string;
  genderPreference: 'male' | 'female' | 'no_preference';
  whyAdopting?: string;
  whyEnded?: string;
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
