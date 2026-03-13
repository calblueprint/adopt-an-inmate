/**
 * Test route for the findMatches and fetchAdopteeCardsInfo functions.
 * Given an appId, it finds the top 4 matching adoptee IDs
 * for the application and returns the full card info for each match. (basically a shortcut around the application questions)
 *
 * To use: GET /api/test-matches?appId=<app-uuid>
 *
 * Requires the user to be logged in
 * for development/testing purposes only
 */
export async function GET() {
  return new Response('Forbidden');

  // const { searchParams } = new URL(request.url);
  // const appId = searchParams.get('appId');

  // if (!appId) return Response.json({ error: 'Missing appId' }, { status: 400 });

  // const { data: ids, error } = await findMatches(appId);
  // if (error) return Response.json({ error });

  // const cards = await fetchAdopteeCardsInfo(ids!);
  // return Response.json(cards);
}
//http://localhost:3000/api/test-matches?appId=<appId>
