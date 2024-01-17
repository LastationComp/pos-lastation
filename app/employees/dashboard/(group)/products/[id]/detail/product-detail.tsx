'use client';

import LoadingComponent from '@/app/_components/LoadingComponent';
import PosButton from '@/app/_components/PosButton';
import { fetcher } from '@/app/_lib/Fetcher';
import PosTableNew from '@/app/_lib/NextUiPos/PosTable';
import { formatRupiah } from '@/app/_lib/RupiahFormat';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import nProgress from 'nprogress';
import React from 'react';
import Swal from 'sweetalert2';
import useSWR from 'swr';

export default function ProductDetail({ id, session }: { id: string; session: any }) {
  const router = useRouter();
  const { data, mutate } = useSWR(`/api/employee/products/${id}/detail?license=${session?.user?.license_key}`, fetcher);

  const handleDelete = async (suId: string) => {
    const res = await fetch(`/api/employee/sellingunits/${suId}?pid=${id}`, {
      method: 'DELETE',
    });

    const result = await res.json();

    if (!res.ok && res.status !== 200)
      return Swal.fire({
        icon: 'error',
        title: result?.message,
      });

    mutate(data);
    return Swal.fire({
      icon: 'success',
      title: result?.message,
    });
  };

  const showWarningDelete = (id: string, name: string) => {
    Swal.fire({
      icon: 'warning',
      title: `<span class="text-md font-normal">Are you sure to delete unit <b>${name}</b>?</span>`,
      showCancelButton: true,
      width: 600,
      showConfirmButton: true,
      confirmButtonText: 'Yes',
    }).then((res) => {
      if (res.isConfirmed) return handleDelete(id);
    });
  };
  const productDetailData = () => {
    let newData = data?.detail?.sellingUnits.map((su: any, i: number) => {
      return {
        key: i + 1,
        no: i + 1,
        unit: su.unit.name + (su.is_smallest ? '(Smallest Unit)' : ''),
        stock: su.stock,
        price: formatRupiah(su.price),
        action: (
          <div className="p-3 flex gap-3">
            <Link href={'/employees/dashboard/products/sellingunits/' + su.id + '/edit'} className="text-yellow-600 underline font-semibold">
              Edit
            </Link>
            {!su.is_smallest && (
              <button onClick={() => showWarningDelete(su.id, su.unit?.name)} className="text-red-600 underline font-semibold">
                Delete
              </button>
            )}
          </div>
        ),
      };
    });
    return newData;
  };
  if (!data)
    return (
      <div className="col-span-2">
        <LoadingComponent />
      </div>
    );
  return (
    <>
      <div className="flex flex-col col-span-2 md:col-span-1">
        <label htmlFor="barcode">Barcode</label>
        <input type="text" id="barcode" name="barcode" value={data?.detail?.barcode} readOnly disabled className="rounded outline outline-1 outline-posblue px-3 py-1" />
      </div>
      <div className="flex flex-col col-span-2 md:col-span-1">
        <label htmlFor="product-name">Product Name</label>
        <input type="text" id="product-name" name="barcode" value={data?.detail?.product_name} readOnly disabled className="rounded outline outline-1 outline-posblue px-3 py-1" />
      </div>

      <div className="col-span-2">
        <div className="flex justify-between items-center">
          <span className="my-3 font-semibold">Selling Units</span>
          {!data?.isMaxUnit && (
            <PosButton
              icon={faPlus}
              onClick={() => {
                nProgress.start();
                router.push('sellingunits');
              }}
            >
              Add Selling Units
            </PosButton>
          )}
          {data?.isMaxUnit && <span>Can&apos;t Add</span>}
        </div>
        <PosTableNew columns={['Unit', 'Stock', 'Price', 'Action']} data={productDetailData()} />
      </div>
    </>
  );
}
