// export { default } from 'next-auth/middleware';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const pathSuperAdmin = '/superadmin';
  const pathAdmin = '/admins';
  const pathEmployee = '/employees';
  const token: any = await getToken({ req: req });
  const sessionToken = process.env.NODE_ENV !== 'production' ? 'next-auth.session-token' : '__Secure-next-auth.session-token';
  const callbackUrl = process.env.NODE_ENV !== 'production' ? 'next-auth.callback-url' : '__Secure-next-auth.callback-url';
  const redirect = (pathNow: any) => {
    return Response.redirect(new URL(pathNow, req.url));
  };

  if(token && token?.role === 'employee') {
    const dateShopOpen: Date = new Date(token?.permissions?.shop_open_hours)
    const dateCloseOpen: Date = new Date(token?.permissions?.shop_close_hours)
    const shop_open = dateShopOpen.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }).replace('24', '00');
    const shop_close = dateCloseOpen.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }).replace('24', '00') ?? '';
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }).replace('24', '00') ?? '';
    const timeWork = shop_open <= timeNow && timeNow < shop_close
    if (!timeWork) {
      const response = NextResponse.redirect(new URL('/', req.url));
      response.cookies.delete(sessionToken);
      return response
    }
  }

  if (pathname.startsWith(pathSuperAdmin)) {
    if (token && token?.role !== 'super_admin') return redirect(req.cookies.get(callbackUrl)?.value ?? '/');
    if (pathname === pathSuperAdmin + '/login' && token?.role === 'super_admin') return redirect(pathSuperAdmin + '/dashboard');
    if (pathname.startsWith(pathSuperAdmin + '/dashboard') && token?.role !== 'super_admin') return redirect(pathSuperAdmin + '/login');
  }

  if (pathname === '/') {
    if (token?.role === 'admin') return redirect(pathAdmin + '/dashboard');
    if (token?.role === 'employee') return redirect(pathEmployee + '/dashboard');
    if (token && token?.role !== 'admin') return redirect(req.cookies.get(callbackUrl)?.value ?? '/');
    if (token && token?.role !== 'employee') return redirect(req.cookies.get(callbackUrl)?.value ?? '/');
  }

  if (pathname.startsWith(pathAdmin)) {
    if (pathname.startsWith(pathAdmin + '/dashboard') && token?.role !== 'admin') return redirect(req.cookies.get(callbackUrl)?.value ?? '/');
  }

  if (pathname.startsWith(pathEmployee)) {
    if (pathname.startsWith(pathEmployee + '/dashboard') && token?.role !== 'employee') return redirect(req.cookies.get(callbackUrl)?.value ?? '/');
    if (pathname.startsWith(pathEmployee + '/dashboard/products/add') && !token?.permissions?.emp_can_create) return redirect(pathEmployee + '/dashboard/products')
    if (pathname.startsWith(pathEmployee + '/dashboard/products') && pathname.endsWith('/edit') && !token?.permissions?.emp_can_update) return redirect(pathEmployee + '/dashboard/products');
  
  }
}

export const config = { matcher: ['/superadmin/:path*', '/admins/:path*', '/', '/employees/:path*'] };
