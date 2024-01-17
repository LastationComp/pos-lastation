import React from 'react';
import ButtonTransactions from './button-transaction';
import SalesHistoryTable from './sales-history-table';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/authOptions';

export default async function AdminSalesHistoryPage() {
  const session = await getServerSession(authOptions);
  return (
    <>
      <div className="mt-5">
        <div className="flex flex-row justify-between gap-3">
          <div className="wrapper p-5 rounded-xl shadow-lg w-full bg-white max-h-screen">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Sales History</h1>
              <ButtonTransactions />
            </div>
            <div className="mt-3">
              <SalesHistoryTable session={session} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
