import NextAuthProvider from '@/app/_components/NextAuthProvider';
import React from 'react';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ButtonLogout from '@/app/_components/ButtonLogout';
import NavbarMenu from '@/app/_components/NavbarMenu';
import Provider from '@/app/_components/Provider';

export default async function DashboardAdminLayout({ children }: { children: React.ReactNode }) {
  const session: any = await getServerSession(authOptions);
  return (
    <>
      <nav className="w-screen bg-blue-600 flex justify-between p-3 text-white">
        <ul className="flex items-center gap-5">
          <li>
            <h1 className="text-lg font-bold">Dashboard</h1>
          </li>
          <li>
            <h1>Selamat Datang, {session?.user?.name}</h1>
          </li>
        </ul>
        <ul className="items-center">
          <li>
            <ButtonLogout />
          </li>
        </ul>
      </nav>
      <NavbarMenu session={session} />

      <div className="container mx-auto">
        <Provider session={session}>{children}</Provider>
      </div>
    </>
  );
}
