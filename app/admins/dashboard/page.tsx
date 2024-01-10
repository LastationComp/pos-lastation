import React from 'react';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/authOptions';
import dynamic from 'next/dynamic';
import LoadingComponent from '@/app/_components/LoadingComponent';

const DashboardGrid = dynamic(() => import('./dashboard-grid'), { ssr: false, loading: () => <LoadingComponent /> });
const SalesHistoryTable = dynamic(() => import('./sales-history-table'), { ssr: false, loading: () => <LoadingComponent /> });
export default async function AdminDashboardPage() {
  const session: any = await getServerSession(authOptions);

  return (
    <>
      <DashboardGrid session={session} />

      <div className="flex flex-col justify-center mt-4 p-4 bg-white rounded-md shadow-lg">
        <div className="flex justify-start items-center w-full px-5 py-3"></div>
        <div className="flex justify-between items-center w-full p-5">
          <p className="text-2xl font-bold">Sales History</p>
        </div>
        <div className="w-full justify-beetwen items-center px-5">
          <SalesHistoryTable session={session} />
        </div>
      </div>
    </>
  );
}
