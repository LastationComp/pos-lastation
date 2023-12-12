'use client';
import { fetcher } from '@/app/_lib/Fetcher';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons/faCaretLeft';
import { faPencil } from '@fortawesome/free-solid-svg-icons/faPencil';
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { BaseSyntheticEvent, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import useSWR from 'swr';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const session: any = useSession();
  const { data } = useSWR(`/api/employee/products/${params.id}?license=${session?.data?.user?.license_key}`, fetcher);
  const router = useRouter();
  const [barcode, setBarcode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [productName, setProductName] = useState('');

  const handleSubmit = async () => {
    const res = await fetch(`/api/employee/products/${params.id}?license=${session?.data?.user?.license_key}`, {
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
    setIsLoading(true);
    Swal.fire({
      icon: 'warning',
      title: `<span class="text-md font-normal">Are you sure to edit Product with barcode <b>${barcode}</b>?</span>`,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Yes',
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
    <>
      <h1 className="text-lg font-bold">Edit Product</h1>
      <form action="" method="post" onSubmit={showWarning}>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col w-full">
            <label htmlFor="barcode">Barcode</label>
            <input type="text" name="barcode" id="barcode" value={barcode} readOnly disabled className="rounded outline outline-1 outline-posblue px-3 py-1" />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="product-name">Product Name</label>
            <input type="text" name="product_name" id="product-name" value={productName} onChange={(e) => setProductName(e.target.value)} className="rounded outline outline-1 outline-posblue px-3 py-1" />
          </div>
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
    </>
  );
}
