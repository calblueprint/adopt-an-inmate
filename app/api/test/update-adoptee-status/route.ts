// import Logger from '@/actions/logging';
// import { mondayApiClient } from '@/actions/monday/core';
// import { updateAdopteeMondayStatus } from '@/actions/monday/mutations/changeStatus';

export async function GET() {
  return new Response('Forbidden');

  // const ids = ['']; //set to 4 or less adoptee (monday) IDs
  // const status = 'WL'; //set to WL or OFC, and uncomment if block for OFC

  // const result = await updateAdopteeMondayStatus(ids, status);

  // console.log('[test:updateAdopteeMondayStatus]', {
  //   ids,
  //   status,
  //   result,
  // });

  // if (status === 'OFC') {
  //   //since only WL makes the actual change
  //   try {
  //     const query = `
  //       mutation {
  //         ${result.data}
  //       }
  //     `;
  //     await mondayApiClient.request(query);
  //   } catch (error) {
  //     Logger.error(
  //       `Failed to update adoptee Monday status to WL for ids ${ids.join(',')}: ${error}`,
  //     );
  //     return Response.json(
  //       { data: null, error: 'An unexpected error occurred.' },
  //       { status: 500 },
  //     );
  //   }
  // }

  // return Response.json(result);
}
