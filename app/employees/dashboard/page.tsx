import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/authOptions';
import dynamic from 'next/dynamic';

const TransactionsPage = dynamic(() => import('./transactions-page'), { ssr: false });
export default async function DashboardEmployeePage() {
  const session = await getServerSession(authOptions);
  return (
    <>
      <h1 className="text-2xl font-semibold">Transactions</h1>
      <TransactionsPage session={session} />
    </>
  );
}
