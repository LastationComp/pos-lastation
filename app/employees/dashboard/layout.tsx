import React, { Suspense } from 'react';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/app/api/auth/authOptions';
import Provider from '@/app/_components/Provider';
import NavbarEmployee from '@/app/_components/employees/NavbarEmployee';

export default async function DashboardEmployeeLayout({ children }: { children: React.ReactNode }) {
  const session: any = await getServerSession(authOptions);
  return (
    <>
      <Provider session={session}>
        <div className="w-screen">
          <NavbarEmployee />
        </div>
        <section className="container mx-auto">
          <Suspense fallback={<h1>Loading...</h1>}>{children}</Suspense>
        </section>
      </Provider>
    </>
  );
}
