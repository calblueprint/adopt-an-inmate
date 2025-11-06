export interface ApplicationState {
  appId: string;
  highestStageAchieved: 'pre' | 'main' | 'matches' | 'submitted';
  form: Partial<FormState>;
  matchId: string | null;
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
