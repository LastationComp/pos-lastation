
'use client';
import LoadingComponent from '@/app/_components/LoadingComponent';
import PosButton from '@/app/_components/PosButton';
import PosTable from '@/app/_components/PosTable';
import TransactionLists from '@/app/_components/employees/transactions/TransactionLists';
import { fetcher } from '@/app/_lib/Fetcher';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons/faClockRotateLeft';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Products, SellingUnits } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import useSWR from 'swr';

export default function DashboardEmployeePage() {
  const { data: session }: any = useSession();
  const router = useRouter()
  const {data, mutate} = useSWR(`/api/employee/transactions?license=${session?.user?.license_key}`, fetcher)
  const [transactionLists, setTransactionLists]: any = useState([])
  const checkSelectedProduct = (id: string) => {
    const checkIsSelected = transactionLists.find((tsx: Products) => tsx.id === id);
    if (!checkIsSelected) return true
    return false
  }

  const reloadMutate = () => {
    mutate(data)
  }
  if (!data) return <LoadingComponent />
  return (
    <>
      <div id='bodywithoutprint' className="grid grid-cols-6 place-content-stretch h-max gap-5 my-5">
        <div className="bg-white drop-shadow-xl rounded-lg p-5 col-span-3">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold">Transactions</h1>
            <PosButton icon={faClockRotateLeft} onClick={() => router.push('/')}>
                Transactions History
            </PosButton>
          </div>
          <PosTable fixed headers={['Barcode', 'Product Name', 'Action']}>
            {data &&
              data?.list_products.map((product: any, i: number) => (
                <tr key={product.id} className="odd:bg-poslight even:bg-slate-200">
                  <td className="p-3">{product.barcode}</td>
                  <td className="p-3">{product.product_name}</td>
                  <td className="p-3">
                    {checkSelectedProduct(product.id) && (
                      <button
                        onClick={() => {
                          let transactions = [...transactionLists];

                          transactions.push(product);

                          setTransactionLists(transactions);
                        }}
                        className="bg-posblue rounded px-2"
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </button>
                    )}
                    {/* {!checkSelectedProduct(product.id) && (
                      <button
                        onClick={() => {
                          let result = transactionLists.findIndex((res: Products) => res.id === product.id);
                          let transactions = [...transactionLists];
                          transactions.splice(result, 1);
                          setTransactionLists(transactions);
                        }}
                        className="bg-red-600 rounded px-2 py-1 text-white"
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
                    )} */}
                  </td>
                </tr>
              ))}
          </PosTable>
        </div>
        <div className="bg-white shadow-md rounded-lg p-3 col-span-3 ">
          <TransactionLists mutate={reloadMutate} session={session} transactions={transactionLists} setTransaction={setTransactionLists} />
        </div>
      </div>
    </>
  );
}
