import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/utils';

export async function middleware(req: NextRequest) {
  const token = req && req.cookies ? req.cookies.get('token')?.value : null;

  let userId;

  if (token) {
    userId = await verifyToken(token);
  }
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.includes('/api/login') ||
    userId ||
    pathname.includes('/static')
  ) {
    return NextResponse.next();
  }

  if ((!token || !userId) && pathname !== '/login') {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.rewrite(url);
  }
}
