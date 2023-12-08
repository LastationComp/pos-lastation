'use client'
import React from 'react';
import Link from 'next/link'
import {usePathname} from 'next/navigation';
export default function NavbarMenu({ session }: { session: any }) {
    const pathAdmin = '/admins/dashboard'
    const pathname = usePathname()
    const generateLink = (link: string, name: string) => {
        const realPath = pathAdmin + link
        return (
          <Link href={pathAdmin + link} className={'transition hover:underline  hover:underline-offset-4 hover:text-white rounded px-3 py-1 ' + (pathname === realPath ? 'underline underline-offset-4 text-white' : 'text-posgray')}>
            {name}
          </Link>
        );
    }
  if (session?.user?.role === 'admin')
    return (
      <nav className="w-screen bg-posblue flex justify-start p-3 text-white">
        <ul className="flex items-center gap-3">
          <li className="">{generateLink('', 'Home')}</li>
          <li className="">{generateLink('/employees', 'Employees')}</li>
          <li className="">{generateLink('/settings', 'Settings')}</li>
          <li className="">{generateLink('/profile/' + session?.user?.username ?? '', 'Profile')}</li>
        </ul>
      </nav>
    );
}
