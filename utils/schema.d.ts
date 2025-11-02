export type UUID = string;

export interface Profile {
  user_id: UUID;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  pronouns: string;
  state: string;
  veteran_status: boolean;
}
