import React from 'react';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/authOptions';
import dynamic from 'next/dynamic';

const FormMember = dynamic(() => import('./form-member'), { ssr: false });
export default async function EmployeeAddMemberPage() {
  const session = await getServerSession(authOptions);
  return (
    <>
      <h1 className="text-2xl font-semibold">Add Member</h1>
      <FormMember session={session} />
    </>
  );
}
