import React from 'react';
import FormAdd from './form-add';

export default function SuperAdminUnitCreate() {
  return (
    <div className="flex flex-col  items-center">
      <h1 className="text-[24px] font-semibold">Add Unit</h1>
      <FormAdd />
    </div>
  );
}
