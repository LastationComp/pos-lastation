// export { default } from 'next-auth/middleware';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
export async function middleware(req: NextRequest, res: Response) {
  const pathname = req.nextUrl.pathname;
  const pathSuperAdmin = '/superadmin'
  const token = await getToken({ req: req });
  if (pathname.startsWith(pathSuperAdmin)) {
    if (pathname.startsWith(pathSuperAdmin + '/login') && token) return Response.redirect(new URL('/superadmin/dashboard', req.url));
    if (pathname.startsWith(pathSuperAdmin + '/dashboard') && !token) return Response.redirect(new URL('/superadmin/login', req.url));
  }
}

export const config = { matcher: ['/superadmin/:path*'] };
