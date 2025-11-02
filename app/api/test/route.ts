import { createRow } from '@/actions/monday/mutation';

export async function GET() {
  const { success, error } = await createRow({
    date_of_birth: new Date().toISOString().split('T')[0],
    first_name: 'First',
    last_name: 'Last',
    pronouns: 'he/him',
    state: 'California',
    user_id: 'asd',
    veteran_status: false,
  });

  if (success) return new Response('Row inserted successfully.');
  return new Response(`${new String(error)}`);
}
