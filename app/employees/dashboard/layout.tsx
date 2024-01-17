import React, { Suspense } from 'react';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/app/api/auth/authOptions';
import Provider from '@/app/_components/Provider';
import NavbarEmployee from '@/app/_components/employees/NavbarEmployee';
import LoadingComponent from '@/app/_components/LoadingComponent';

export default async function DashboardEmployeeLayout({ children }: { children: React.ReactNode }) {
  const session: any = await getServerSession(authOptions);
  return (
    <>
      <Provider session={session}>
        <div className="">
          <NavbarEmployee />
        </div>
        <section className="lg:container lg:mx-auto">
          <Suspense fallback={<LoadingComponent />}>{children}</Suspense>
        </section>
      </Provider>
    </>
  );
}
