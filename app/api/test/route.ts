import { createRow } from '@/actions/monday/mutation';

export async function GET() {
  const error = await createRow({
    date_of_birth: new Date().toISOString().split('T')[0],
    first_name: 'First',
    last_name: 'Last',
    pronouns: 'he/him',
    state: 'California',
    user_id: 'asd',
    veteran_status: false,
  });

  return new Response(`${new String(error)}`);
}
