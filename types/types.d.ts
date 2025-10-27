export interface ApplicationState {
  appId: string;
  highestStageAchieved: 'pre' | 'main' | 'matches' | 'submitted';
  form: FormState;
  draft: FormState;
}

export interface FormState {
  mainApp?: never;
  matchId?: never;
}

export interface EmailPasswordCredentials {
  email: string;
  password: string;
}
