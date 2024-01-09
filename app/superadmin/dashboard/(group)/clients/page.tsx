import React, { Suspense } from 'react';
import AddButton from './add-button';
import LoadingComponent from '@/app/_components/LoadingComponent';
import dynamic from 'next/dynamic';

const ClientTable = dynamic(() => import('./client-table'));
export default function Dashboard() {
  return (
    <>
      <div className="flex justify-between items-center">
        <div className="text-xl font-semibold">Clients</div>
        <AddButton />
      </div>
      <Suspense fallback={<LoadingComponent />}>
        <ClientTable />
      </Suspense>
    </>
  );
}
