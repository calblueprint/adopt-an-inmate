import createAdopterApplication from '@/actions/monday/mutations/createAdopterApplication';

export async function GET() {
  const { success, error } = await createAdopterApplication(
    {
      date_of_birth: new Date('2000-01-01').toISOString().split('T')[0],
      first_name: 'Blueprint',
      last_name: 'Test',
      pronouns: 'he/him',
      state: 'California',
      user_id: 'asd',
      veteran_status: false,
      monday_id: null,
    },
    {
      adopter_uuid: 'asd',
      app_uuid: 'asd',
      gender_pref: 'No preference',
      offense_pref: [],
      personal_bio: 'Blueprint Test',
      ranked_cards: [],
      return_explanation: '',
      status: 'pending',
      time_submitted: new Date().toISOString().split('T')[0],
      monday_id: null,
      exported_to_monday: false,
      age_pref: [],
    },
  );

  if (success) return new Response('Row inserted successfully.');
  return new Response(`${new String(error)}`);
}
