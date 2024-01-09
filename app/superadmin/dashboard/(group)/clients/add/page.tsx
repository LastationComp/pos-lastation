import React from 'react';
import FormAdd from './form-add';

export default function ClientAdd() {
  return (
    <section className="flex justify-center">
      <div className="rounded shadow-md p-3 bg-white">
        <h1 className="text-lg">Add Client</h1>
        <FormAdd />
      </div>
    </section>
  );
}
