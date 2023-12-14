'use client'
import LoadingComponent from '@/app/_components/LoadingComponent'
import PosButton from '@/app/_components/PosButton'
import PosTable from '@/app/_components/PosTable'
import { fetcher } from '@/app/_lib/Fetcher'
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import useSWR from 'swr'

export default function AdminSalesHistoryPage() {
    const router = useRouter()
    const session : any = useSession()
    const license_key = session?.data?.user?.license_key

    const [showReceipt, setShowReceipt] = useState(true)
    const [receipt, setReceipt] : any = useState()
    const {data} = useSWR(`/api/employee/saleshistory?license=${license_key}`, fetcher)

    const handleReceipt = async (no_ref:string) => {
      setShowReceipt(false)
      const res = await fetch(`/api/employee/saleshistory/${no_ref}`,{cache: 'no-store'})
      const dataReceipt = await res.json()
      setReceipt(dataReceipt)
    }
  return (
    <>
    <div className='mt-5'>
      <div className='flex flex-row justify-between'>
        <div className='wrapper p-5 rounded-xl shadow-lg w-[800px] bg-white'>
          <div className='flex justify-between items-center'>
            <h1 className='text-2xl font-bold'>Sales History</h1>
            <PosButton icon={faPlus} onClick={() => router.push('/employees/dashboard/saleshistory/add')}>Transaction</PosButton>
          </div>
          <div className='mt-3'>
          <PosTable fixed headers={['Nomor Referensi',  'Tanggal',  'Employee','Total', "Action"]}>
          {data && data.salesHistory.map((sales : any, index : number) => (
              <tr key={index+1}>
                <td className='p-3'>{sales.no_ref}</td>
                <td className='p-3'>{sales.created_at}</td>
                <td className='p-3'>{sales.employee.name}</td>
                <td className='p-3'>Rp. {sales.total_price}</td>
                <td className='p-3'>
                  <div className='flex gap-2'>
                      <button onClick={() => handleReceipt(sales.no_ref)} className="'text-black bg-teal-300 px-5 py-1 rounded-md hover:text-white hover:bg-teal-500 transition'" ><FontAwesomeIcon icon={faEye}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </PosTable>
          </div> 
        </div>
        <div className='wrapper p-2 shadow-lg w-[450px] h-full bg-white rounded-xl'>
          <div className='flex justify-center items-center'>
            <div className='flex flex-col'>
              <h1 className='text-2xl font-bold flex justify-center'>Transaction Details</h1>
                <div className='flex flex-col gap-2'>
                <div className="border-t-[2px] border-solid border-black"></div>
                {receipt && 
                  <div className='wrapper w-[400px] h-[450px] bg-gray-200' hidden={showReceipt}>
                    <div className='flex flex-col'>
                      <div className='flex justify-center mt-5'>
                        <div className='flex gap-1'>
                          <div className='flex flex-col'>
                            <h1 className='flex justify-center text-sm font-semibold'>{receipt?.receiptDetail?.employee?.admin?.client?.client_name}</h1>
                          </div>
                        </div>
                      </div>
                      <div className='flex justify-center mt-2'>
                        <div className='grid grid-rows-2 grid-flow-col gap-x-12 gap-y-1'>
                          <div className='text-xs font-semibold'>Kasir : {receipt?.receiptDetail?.employee?.name}</div>
                          <div className='text-xs font-semibold'>Waktu : {receipt?.receiptDetail?.created_at}</div>
                          <div className='text-xs font-semibold'>Member : {receipt?.receiptDetail?.customer?.name ?? "-"}</div>
                          <div className='text-xs font-semibold flex justify-center'>{receipt?.receiptDetail?.created_at}</div>
                        </div>
                      </div>
                      <div className='p-5'>
                      <table className='w-full table-auto'>
                        <thead className='border border-x-0 border-y-2 border-dashed border-black'>
                          <tr>
                            <th className='text-start text-xs py-2 w-1/2'>Produk</th>
                            <th className='text-center text-xs'>Qty</th>
                            <th className='text-center text-xs'>Harga</th>
                            <th className='text-center text-xs'>Total</th>
                          </tr>
                        </thead>
                        <tbody className='border border-x-0 border-y-2 border-dashed border-black'>
                        {receipt && receipt?.receiptDetail?.transactionLists.map((receipt :any, index:number) => (
                          <tr key={index+1}>
                            <td className='text-xs font-semibold py-2'>{receipt?.sellingUnit?.product?.product_name}</td>
                            <td className='text-center text-xs font-semibold py-2'>{receipt?.qty}</td>
                            <td className='text-center text-xs font-semibold py-2'>{receipt?.sellingUnit?.price}</td>
                            <td className='text-center text-xs font-semibold py-2'>{receipt?.total_price}</td>
                          </tr>
                            ))}
                        </tbody>
                      </table>
                      <div className='pt-2'>
                          <h1 className='text-xs font-semibold py-1'>Total : Rp. 42.000,</h1>
                          <h1 className='text-xs font-semibold py-1'>Tunai : Rp. 50.000,</h1>
                          <h1 className='text-xs font-semibold py-1'>Kembali : Rp. 8.000</h1>
                      </div>
                      <div className="border border-x-0 border-y-[1px] border-dashed border-black"></div>                    
                        <div className='flex justify-center'>
                          <h1 className='text-xs font-semibold text-center py-2'>
                            Terima Kasih Atas Kunjungan Anda <br /> 
                            Periksa Barang sebelum dibeli <br /> 
                            note : Barang yang sudah dibeli tidak bisa ditukar</h1>
                        </div>
                      </div>
                    </div>
                  </div>
                }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
