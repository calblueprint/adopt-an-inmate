// test route for queryMatchedAdoptees

// import { queryMatchedAdoptees } from '@/actions/monday/queryMatchedAdoptee';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: Request) {
  // default to a forbidden, as this is a test route and should not be called by a user
  return Response.json({ data: null, error: 'Forbidden' }, { status: 403 });

  // uncomment to test queryMatchedAdoptees

  // const url = new URL(req.url);
  // const applicationId = url.searchParams.get('applicationId') ?? '';

  // const result = await queryMatchedAdoptees(applicationId);

  // console.log(
  //   '[matchedAdoptee] applicationId=',
  //   applicationId,
  //   'result=',
  //   result,
  // );

  // return Response.json(result);
}
