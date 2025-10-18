export interface ApplicationState {
  appId: string;
  highestStageAchieved: 'pre' | 'main' | 'matches' | 'submitted';
}

export interface EmailPasswordCredentials {
  email: string;
  password: string;
}
