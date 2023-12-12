
import NextAuthProvider from '@/app/_components/NextAuthProvider';
import React, { Suspense } from 'react';
import {getServerSession} from 'next-auth/next'

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ButtonLogout from '@/app/_components/ButtonLogout';
import Provider from '@/app/_components/Provider';

import { usePathname } from 'next/navigation';
import NavbarEmployee from '@/app/_components/employees/NavbarEmployee';


export default async function DashboardEmployeeLayout({ children }: { children: React.ReactNode }) {
const session: any = await getServerSession(authOptions)
  return (
    <>
      <NavbarEmployee session={session} />
      <section className="container mx-auto">
        <Provider session={session}>
          <Suspense fallback={<h1>Loading...</h1>}>{children}</Suspense>
        </Provider>
      </section>
    </>
  );
}

