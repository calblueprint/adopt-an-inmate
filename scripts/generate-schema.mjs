import { exec } from 'node:child_process';
import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';

const loadEnvFileIfExist = file => {
  if (existsSync(file)) loadEnvFile(file);
};

loadEnvFileIfExist('./.env');
loadEnvFileIfExist('./.env.local');

if (!process.env.PROJECT_ID)
  throw new Error('Environment variable PROJECT_ID is not specified.');

exec(
  `pnpx supabase gen types typescript --project-id "${process.env.PROJECT_ID}" --schema public > types/database.types.ts`,
);

exec(`pnpm prettier fix -w types/database.types.ts`);
