'use server';
import LoadingComponent from '@/app/_components/LoadingComponent';
import dynamic from 'next/dynamic';

const FormLoginSuperadmin = dynamic(() => import('./login-superadmin'), { ssr: false, loading: () => <LoadingComponent /> });
export default async function HomeSuperAdmin() {
  return (
    <main className="bg-poslight flex justify-center w-screen h-screen static">
      <section className="flex justify-center items-center text-white">
        <FormLoginSuperadmin />
      </section>
    </main>
  );
}
