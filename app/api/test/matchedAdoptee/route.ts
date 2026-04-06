import { queryMatchedAdopteeForApprovedApplication } from '@/actions/monday/queryMatchedAdoptee';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const applicationId = url.searchParams.get('applicationId') ?? '';

  const result = await queryMatchedAdopteeForApprovedApplication(applicationId);

  // Useful while manually testing with a fake/sandbox row.
  console.log(
    '[matchedAdoptee] applicationId=',
    applicationId,
    'result=',
    result,
  );

  return Response.json(result);
}
