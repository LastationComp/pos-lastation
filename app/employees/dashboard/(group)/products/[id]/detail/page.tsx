'use client';
import LoadingComponent from '@/app/_components/LoadingComponent';
import PosButton from '@/app/_components/PosButton';
import PosTable from '@/app/_components/PosTable';
import { fetcher } from '@/app/_lib/Fetcher';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons/faCaretLeft';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import Swal from 'sweetalert2';
import useSWR from 'swr';

export default function PageProductDetail({ params }: { params: { id: string } }) {
  const session: any = useSession();
  const router = useRouter();
  const { data, mutate } = useSWR(`/api/employee/products/${params.id}/detail?license=${session?.data?.user?.license_key}`, fetcher);
  
  const handleDelete = async(id: string) => {
    const res = await fetch(`/api/employee/sellingunits/${id}?pid=${params.id}`, {
      method: 'DELETE',
    })

    const result = await res.json()

    if (!res.ok && res.status !== 200) return Swal.fire({
      icon: 'error',
      title: result?.message
    })

    mutate(data)
    return Swal.fire({
      icon: 'success',
      title: result?.message
    })
  }

  const showWarningDelete = (id: string, name: string) => {
    Swal.fire({
      icon: 'warning',
      title: `<span class="text-md font-normal">Are you sure to delete unit <b>${name}</b>?</span>`,
      showCancelButton: true,
      width: 600,
      showConfirmButton: true,
      confirmButtonText: 'Yes'
    }).then(res => {
      if (res.isConfirmed) return handleDelete(id)
    })
  }
  if (!data) return <LoadingComponent />;
  return (
    <>
      <div className="text-lg font-semibold">Product detail</div>
      <div className="grid grid-cols-2 gap-5">
        {data && (
          <>
            <div className="flex flex-col">
              <label htmlFor="barcode">Barcode</label>
              <input type="text" id="barcode" name="barcode" value={data?.detail?.barcode} readOnly disabled className="rounded outline outline-1 outline-posblue px-3 py-1" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="product-name">Product Name</label>
              <input type="text" id="product-name" name="barcode" value={data?.detail?.product_name} readOnly disabled className="rounded outline outline-1 outline-posblue px-3 py-1" />
            </div>

            <div className="col-span-2">
              <div className="flex justify-between items-center">
                <span className="my-3 font-semibold">Selling Units</span>
                {!data?.isMaxUnit && (
                  <PosButton icon={faPlus} onClick={() => router.push('sellingunits')}>
                    Add Selling Units
                  </PosButton>
                )}
                {data?.isMaxUnit && <span>Can't Add</span>}
              </div>
              <PosTable fixed headers={['No', 'Unit', 'Stock', 'Price', 'Action']}>
                {data?.detail?.sellingUnits &&
                  data?.detail?.sellingUnits.map((su: any, i: number) => (
                    <tr key={i + 1} className="odd:bg-poslight even:bg-slate-200">
                      <td className="p-3">{i + 1}</td>
                      <td className="p-3">
                        {su.unit?.name} {su.is_smallest ? '(Smallest Unit)' : ''}
                      </td>
                      <td className="p-3">{su.stock}</td>
                      <td className="p-3">{su.price}</td>
                      <td className="p-3 flex gap-3">
                        <Link href={'/employees/dashboard/products/sellingunits/' + su.id + '/edit'} className="text-yellow-600 underline font-semibold">
                          Edit
                        </Link>
                        {!su.is_smallest && (
                          <button onClick={() => showWarningDelete(su.id, su.unit?.name)} className="text-red-600 underline font-semibold">
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </PosTable>
            </div>
          </>
        )}
        <div className="flex col-span-2 justify-end ">
          <button onClick={() => router.back()} className="bg-posgray flex items-center gap-3 px-3 py-2 hover:bg-gray-600 text-white transition rounded-full">
            <FontAwesomeIcon icon={faCaretLeft} />
            Back
          </button>
        </div>
      </div>
    </>
  );
}
