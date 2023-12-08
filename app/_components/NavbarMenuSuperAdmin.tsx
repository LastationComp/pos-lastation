'use client'
import React from 'react';
import Link from 'next/link'
import {usePathname} from 'next/navigation';
export default function NavbarMenu({ session }: { session: any }) {
    const pathSuperAdmin = '/superadmin/dashboard'
    const pathname = usePathname()
    const generateLink = (link: string, name: string) => {
        const realPath = pathSuperAdmin + link
        return (
          <Link href={pathSuperAdmin + link} className={'transition hover:underline  hover:underline-offset-4 hover:text-white rounded px-3 py-1 ' + (pathname === realPath ? 'underline underline-offset-4 text-white' : 'text-posgray')}>
            {name}
          </Link>
        );
    }
  if (session?.user?.role === 'super_admin')
    return (
      <nav className="w-screen bg-posblue flex justify-start p-3 text-white">
        <ul className="flex items-center gap-3">
          <li className="">{generateLink('', 'Home')}</li>
          <li className="">{generateLink('/clients', 'Clients')}</li>
          <li className="">{generateLink('/units', 'Units')}</li>
        </ul>
      </nav>
    );
}
