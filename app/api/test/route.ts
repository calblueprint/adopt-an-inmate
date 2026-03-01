import exportApplication from '@/actions/monday/mutations/exportApplication';

export async function GET() {
  const { success, error } = await exportApplication(
    '0c2650b0-f188-4253-8182-735f9eeb35cf',
  );

  if (success) return new Response('Row inserted successfully.');
  return new Response(`${new String(error)}`);
}
