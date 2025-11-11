import { ApiClient } from '@mondaydotcomorg/api';
import { assertEnvVarExists } from '@/lib/utils';

assertEnvVarExists('MONDAY_API_TOKEN');

export const mondayApiClient = new ApiClient({
  token: process.env.MONDAY_API_TOKEN ?? '',
});
