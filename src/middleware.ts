import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => request.cookies.get(name)?.value,
        set: (name, value, options) => {
          response.cookies.set(name, value, options);
        },
        remove: (name, options) => {
          response.cookies.delete(name);
        },
      },
    }
  );

  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();

  // If accessing admin routes and not authenticated, redirect to login
  if (request.nextUrl.pathname.startsWith('/admin') && 
      request.nextUrl.pathname !== '/admin/login' && 
      !user) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // If authenticated and trying to access login page, redirect to admin dashboard
  if (request.nextUrl.pathname === '/admin/login' && user) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*']
};
