// export { default } from 'next-auth/middleware';
import { getToken } from 'next-auth/jwt';
import { signOut } from 'next-auth/react';
import { NextRequest } from 'next/server';
export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  req
  const pathSuperAdmin = '/superadmin'
  const pathAdmin = '/admins'
  const pathEmployee = '/employees'
  const token: any = await getToken({ req: req });
  const redirect = (pathNow: any) => {
    return Response.redirect(new URL(pathNow, req.url))
  }

  if (pathname.startsWith(pathSuperAdmin)) {
    if (token && token?.role !== 'super_admin') return redirect(req.cookies.get('next-auth.callback-url')?.value ?? '/')
    if (pathname === pathSuperAdmin + '/login' && token?.role === 'super_admin') return redirect(pathSuperAdmin + '/dashboard')
    if (pathname.startsWith(pathSuperAdmin + '/dashboard') && token?.role !== 'super_admin') return redirect(pathSuperAdmin + '/login')
  }

  if (pathname === '/') {
    if (token?.role === 'admin') return redirect(pathAdmin + '/dashboard')
    if (token && token?.role !== 'admin') return redirect(req.cookies.get('next-auth.callback-url')?.value ?? '/')
    if (token?.role === 'employee') return redirect(pathEmployee + '/dashboard')
    if (token && token?.role !== 'employee') return redirect(req.cookies.get('next-auth.callback-url')?.value ?? '/')
  }


  if (pathname.startsWith(pathAdmin)) {
    if (pathname.startsWith(pathAdmin + '/dashboard') && token?.role !== 'admin') return redirect(req.cookies.get('next-auth.callback-url')?.value ?? '/')
  }

}

export const config = { matcher: ['/superadmin/:path*', '/admins/:path*', '/'] };
