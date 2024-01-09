import { Suspense } from 'react';
import LoadingComponent from '@/app/_components/LoadingComponent';
import dynamic from 'next/dynamic';
import FormLoginSuperadmin from './login-superadmin';

export default function HomeSuperAdmin() {
  return (
    <main className="bg-poslight flex justify-center w-screen h-screen static">
      <section className="flex justify-center items-center text-white">
        <Suspense fallback={<LoadingComponent />}>
          <FormLoginSuperadmin />
        </Suspense>
      </section>
    </main>
  );
}
