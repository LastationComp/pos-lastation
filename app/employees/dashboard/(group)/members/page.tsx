import React from 'react';
import ButtonAdd from './button-add';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/authOptions';
import dynamic from 'next/dynamic';
import LoadingComponent from '@/app/_components/LoadingComponent';
import SearchMembers from './search-members';

const MembersTable = dynamic(() => import('./members-table'), { ssr: false, loading: () => <LoadingComponent /> });
export default async function EmployeeMemberPage() {
  const session = await getServerSession(authOptions);
  return (
    <>
      <div className="mt-3 mx-3">
        <h1 className="text-2xl font-bold">Members Lists</h1>
        <div className="wrapper p-5 rounded-xl shadow-lg w-full bg-white">
          <div className="flex justify-between items-center">
            <div className="w-1/2">
              <SearchMembers />
            </div>
            <ButtonAdd />
          </div>
          <div className="mt-3">
            <MembersTable session={session} />
          </div>
        </div>
      </div>
    </>
  );
}
