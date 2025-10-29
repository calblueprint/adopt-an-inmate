import { UUID } from 'crypto';

export interface Profile {
  user_id: UUID;
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string;
  pronouns: string;
  state: string;
  veteran_status: boolean;
}
