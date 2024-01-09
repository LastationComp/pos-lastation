import LoadingComponent from '@/app/_components/LoadingComponent';
import dynamic from 'next/dynamic';
import React from 'react';

const FormEdit = dynamic(() => import('./form-edit'), { ssr: false, loading: () => <LoadingComponent /> });

export default async function SuperAdminUnitCreate({ params }: { params: { unitId: any } }) {
  return (
    <div className="flex flex-col  items-center">
      <h1 className="text-[24px] font-semibold">Edit Unit</h1>
      <FormEdit unitId={params.unitId} />
    </div>
  );
}
