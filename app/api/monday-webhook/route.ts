import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // verify jwt from request

  // parse events

  // respond to challenge
  console.log(JSON.stringify(request.body));

  return new NextResponse(request.body);
}
