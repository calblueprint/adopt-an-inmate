import { ApiClient } from '@mondaydotcomorg/api';
import { assertEnvVarExists } from '@/lib/utils';

assertEnvVarExists('MONDAY_API_KEY');

export const mondayApiClient = new ApiClient({
  token: process.env.MONDAY_API_KEY ?? '',
});
