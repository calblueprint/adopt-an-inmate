import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import Logger from '@/actions/logging';
import { assertEnvVarExists, getEnvVar } from '@/lib/utils';

assertEnvVarExists('MONDAY_SIGNING_SECRET');

export async function POST(request: NextRequest) {
  const signingSecret = getEnvVar('MONDAY_SIGNING_SECRET');

  const authHeader = request.headers.get('authorization');
  if (!authHeader) return new NextResponse(request.body);

  // verify jwt from request auth header
  try {
    jwt.verify(authHeader, signingSecret);
  } catch (error) {
    Logger.error(`Error decoding JWT from Monday webhook: ${error}`);
    return new NextResponse(request.body);
  }

  // parse events
  const data = await request.json();
  console.log(data);

  // respond to challenge
  return Response.json({ data });
}
