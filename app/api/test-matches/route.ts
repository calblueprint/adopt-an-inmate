import { findMatches } from '@/actions/matching';
import { fetchAdopteeCardsInfo } from '@/actions/queries/query';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const appId = searchParams.get('appId');

  if (!appId) return Response.json({ error: 'Missing appId' }, { status: 400 });

  const { data: ids, error } = await findMatches(appId);
  if (error) return Response.json({ error });

  const cards = await fetchAdopteeCardsInfo(ids!);
  return Response.json(cards);
}
//http://localhost:3000/api/test-matches?appId=<appId>
