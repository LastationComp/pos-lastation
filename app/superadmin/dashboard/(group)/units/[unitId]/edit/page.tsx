import React from 'react';
import FormEdit from './form-edit';

export default async function SuperAdminUnitCreate({ params }: { params: { unitId: any } }) {
  return (
    <div className="flex flex-col  items-center">
      <h1 className="text-[24px] font-semibold">Edit Unit</h1>
      <FormEdit unitId={params.unitId} />
    </div>
  );
}
