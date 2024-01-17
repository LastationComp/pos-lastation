import dynamic from 'next/dynamic';
import React from 'react';

const FormEdit = dynamic(() => import('./form-edit'), { ssr: false });
export default function SellingUnitsEditPage({ params }: { params: { id: string } }) {
  return (
    <>
      <div className="mx-3">
        <h1 className="text-lg font-semibold">Edit Selling Unit</h1>
        <FormEdit id={params.id} />
      </div>
    </>
  );
}
