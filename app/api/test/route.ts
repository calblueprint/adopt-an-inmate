export async function GET() {
  return new Response('Forbidden');
}

// import exportApplication from '@/actions/monday/mutations/exportApplication';

// export async function GET() {
//   const { success, error } = await exportApplication(
//     '29a1a21d-a8e0-40a0-ac25-78dd4343bf33',
//   );

//   if (success) return new Response('Success.');
//   return new Response(`${new String(error)}`);
// }
