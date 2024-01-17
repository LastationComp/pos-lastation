import React from 'react';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/authOptions';
import dynamic from 'next/dynamic';

const FormEdit = dynamic(() => import('./form-edit'), { ssr: false });

export default async function EmployeeEditMemberPage({ params }: { params: { customerCode: string } }) {
  const session = await getServerSession(authOptions);
  return (
    <>
      <div className="flex justify-center">
        <div className="flex flex-col w-screen mt-4 p-4 bg-white mx-3 rounded-md shadow-lg">
          <p className="text-2xl font-semibold p-4">Edit Member</p>
          <FormEdit customerCode={params.customerCode} session={session} />
        </div>
      </div>
    </>
  );
}
