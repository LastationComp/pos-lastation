'use client';

import FallbackMessage from '@/app/_components/FallbackMessage';
import { fetcher } from '@/app/_lib/Fetcher';
import { faCaretLeft, faPencil, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Skeleton } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { BaseSyntheticEvent, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import useSWR from 'swr';

export default function FormEditProduct({ id, session }: { id: string; session: any }) {
  const { data } = useSWR(`/api/employee/products/${id}?license=${session?.user?.license_key}`, fetcher);
  const router = useRouter();
  const [barcode, setBarcode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [productName, setProductName] = useState('');

  const handleSubmit = async () => {
    setIsLoading(true);
    const res = await fetch(`/api/employee/products/${id}?license=${session?.user?.license_key}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application.json',
      },
      body: JSON.stringify({
        product_name: productName,
      }),
    });

    const result = await res.json();

    if (!res.ok && res.status !== 200) {
      return setErrMsg(result?.message);
    }

    return router.back();
  };
  const showWarning = (e: BaseSyntheticEvent) => {
    e.preventDefault();
    Swal.fire({
      icon: 'warning',
      title: `Are you sure to edit?`,
      text: 'Edit with barcode ' + barcode + '?',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((res) => {
      if (res.isConfirmed) return handleSubmit().finally(() => setIsLoading(false));
      setIsLoading(false);
    });
  };
  useEffect(() => {
    setBarcode(data?.product?.barcode);
    setProductName(data?.product?.product_name);
  }, [data]);
  return (
    <form action="" method="post" onSubmit={showWarning}>
      {errMsg && <FallbackMessage message={errMsg} state={'danger'} />}
      <div className="grid grid-cols-2 gap-3">
        <Skeleton isLoaded={data?.product} className="p-1 rounded-md">
          <div className="flex flex-col w-full col-span-2 md:col-span-1">
            <label htmlFor="barcode">Barcode</label>
            <input type="text" name="barcode" id="barcode" value={barcode} readOnly disabled className="rounded outline outline-1 outline-posblue px-3 py-1" />
          </div>
        </Skeleton>
        <Skeleton isLoaded={data?.product} className="p-1 rounded-md">
          <div className="flex flex-col w-full col-span-2 md:col-span-1">
            <label htmlFor="product-name">Product Name</label>
            <input type="text" name="product_name" id="product-name" value={productName} onChange={(e) => setProductName(e.target.value)} className="rounded outline outline-1 outline-posblue px-3 py-1" />
          </div>
        </Skeleton>
        <div className="col-span-2 flex gap-3 justify-end">
          <button type="submit" className="bg-posblue flex items-center gap-3 hover:bg-teal-600 rounded-full px-3 py-2 hover:text-white transition">
            <FontAwesomeIcon icon={isLoading ? faSpinner : faPencil} spin={isLoading} />
            Edit Product
          </button>
          <button type="reset" onClick={() => router.back()} className="bg-posgray flex items-center gap-3 hover:bg-gray-600 rounded-full px-3 py-2 text-white transition">
            <FontAwesomeIcon icon={faCaretLeft} />
            Back
          </button>
        </div>
      </div>
    </form>
  );
}
