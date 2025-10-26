import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // update cookies in the request so
          // server components get updated cookies
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );

          // update cookies in the response so
          // client components get updated cookies
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  // Calling auth.getUser() refreshes the auth token (updates cookies)
  await supabase.auth.getUser();

  //   // IMPORTANT: You *must* return the supabaseResponse object as it is.
  //   // If you're creating a new response object with NextResponse.next() make sure to:
  //   // 1. Pass the request in it, like so:
  //   //    const myNewResponse = NextResponse.next({ request })
  //   // 2. Copy over the cookies, like so:
  //   //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  //   // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //   //    the cookies!
  //   // 4. Finally:
  //   //    return myNewResponse
  //   // If this is not done, you may be causing the browser and server to go out
  //   // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   // DEBUG: Log the current state
//   console.log('🔍 Middleware check:', {
//     path: request.nextUrl.pathname,
//     isLoggedIn: !!user,
//     userEmail: user?.email,
//   });

//   const isOnboardingPage = request.nextUrl.pathname.startsWith('/onboarding');
//   const isLoginPage = request.nextUrl.pathname.startsWith('/login');

//   if (!user && isOnboardingPage) {
//     console.log('❌ Redirecting to /login - user not authenticated');
//     const redirectUrl = new URL('/login', request.url);
//     return NextResponse.redirect(redirectUrl);
//   }

//   if (user && isLoginPage) {
//     console.log('✅ Redirecting to / - user already logged in');
//     const redirectUrl = new URL('/', request.url);
//     return NextResponse.redirect(redirectUrl);
//   }

//   return supabaseResponse;
// }
