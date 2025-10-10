import { loadEnvConfig } from '@next/env';

export const loadEnvironment = () => {
  const projectDir = process.cwd();
  loadEnvConfig(projectDir);
};
