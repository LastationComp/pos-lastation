import authOptions from '@/app/api/auth/authOptions';
import { getServerSession } from 'next-auth';
import React from 'react';
import FormProfile from './form-profile';

export default async function EmployeeProfilePage() {
  const session = await getServerSession(authOptions);
  return (
    <>
      <div className="flex justify-center mx-3">
        <FormProfile session={session} />
      </div>
    </>
  );
}
