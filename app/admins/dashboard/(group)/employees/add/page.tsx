import React from 'react';
import FormAdd from './form-add';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/authOptions';

export default async function AddEmployeePage() {
  const session: any = await getServerSession(authOptions);

  return (
    <div className="flex flex-col mx-auto justify-center mt-4 p-4 bg-white rounded-md shadow-lg">
      <p className="text-2xl font-semibold mb-2">Add Employee</p>
      <FormAdd session={session} />
    </div>
  );
}
