'use client'
import React from 'react';
import Link from 'next/link'
import {usePathname} from 'next/navigation';
export default function NavbarMenu({ session }: { session: any }) {
    const pathAdmin = '/admins/dashboard'
    const pathname = usePathname()
    const generateLink = (link: string, name: string) => {
        return (
          <Link href={link} className={'transition hover:underline  hover:underline-offset-4 hover:text-white rounded px-3 py-1 ' + (pathname === link ? 'underline underline-offset-4 text-white' : 'text-posgray')}>
            {name}
          </Link>
        );
    }
  if (session?.user?.role === 'admin')
    return (
      <nav className="w-screen bg-posblue flex justify-start p-3 text-white">
        <ul className="flex items-center gap-3">
          <li className="">{generateLink(pathAdmin, 'Home')}</li>
          <li className="">{generateLink(pathAdmin + '/employees', 'Employees')}</li>
          <li className="">{generateLink(pathAdmin + '/settings', 'Settings')}</li>
          <li className="">{generateLink(pathAdmin + '/profile/' + session?.user?.username ?? '', 'Profile')}</li>
        </ul>
      </nav>
    );
}
