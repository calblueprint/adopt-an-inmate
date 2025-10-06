export interface ApplicationState {
  appId: string;
  highestStageAchieved: 'pre' | 'main' | 'matches' | 'submitted';
}
