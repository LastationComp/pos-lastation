'use client';

import FallbackMessage from '@/app/_components/FallbackMessage';
import { fetcher } from '@/app/_lib/Fetcher';
import { faBox } from '@fortawesome/free-solid-svg-icons/faBox';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons/faCaretLeft';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Units } from '@prisma/client';
import { useRouter } from 'next/navigation';
import React, { BaseSyntheticEvent, useState } from 'react';
import useSWR from 'swr';

export default function FormAddSellingUnitsBackup({ id, session }: { id: string; session: any }) {
  const [sellingUnits, setSellingUnits] = useState([1]);
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const router = useRouter();
  let dataSellingUnits: any[] = [];

  const { data } = useSWR(`/api/employee/products/${id}/units?license=${session?.user?.license_key}`, fetcher, {
    revalidateOnFocus: false,
  });

  const handleSubmit = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const formdata = new FormData(e.currentTarget);
    dataSellingUnits = [];
    sellingUnits.forEach((unit) => {
      dataSellingUnits.push({
        unit_id: Number(formdata.get('unit-id-' + unit)),
        is_smallest: false,
        stock: Number(formdata.get('stock-product-' + unit) ?? 0),
        price: Number(formdata.get('price-product-' + unit) ?? 0),
      });
    });

    const body = {
      id: session?.user?.id ?? '',
      license_key: session?.user?.license_key ?? '',
      dump_unit: data?.units,
      selling_units: dataSellingUnits,
    };

    const res = await fetch(`/api/employee/products/${id}/sellingunits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const result = await res.json();
    setIsLoading(false);
    if (!res.ok && res.status !== 200) {
      return setErrMsg(result?.message);
    }

    return router.back();
  };
  return (
    <form action="" method="post" onSubmit={handleSubmit}>
      <div className="my-3">{errMsg && <FallbackMessage message={errMsg} state={'danger'} />}</div>
      <div className="grid grid-cols-4 gap-3">
        {sellingUnits.map((index, i) => (
          <div key={i + 1} className="flex flex-col col-span-2 my-3 justify-center gap-3">
            <div className="flex flex-col w-full">
              <label htmlFor={'product-name-' + index}>Unit</label>
              <select name={'unit-id-' + index} id={'product-name-' + index} className="rounded outline outline-1 outline-posblue px-3 py-1">
                {data &&
                  data?.units.map((data: Units) => (
                    <option value={data.id} key={data.id}>
                      {data.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex flex-col col-span-1">
              <label htmlFor={'stock-product-' + index}>Stock</label>
              <input type="number" name={'stock-product-' + index} placeholder="Input your stock" required className="rounded outline outline-1 outline-posblue px-3 py-1" id={'stock-product-' + index} />
            </div>
            <div className="flex flex-col col-span-2">
              <label htmlFor={'price-product-' + index}>Price</label>
              <input type="number" name={'price-product-' + index} placeholder="Input your price" required className="rounded outline outline-1 outline-posblue px-3 py-1" id={'price-product-' + index} />
            </div>
          </div>
        ))}
        <div className="col-span-2 flex gap-3 border-dashed border-2 border-slate-600 justify-center items-center p-5">
          {sellingUnits.length !== data?.units.length && (
            <button
              className="flex items-center gap-3 p-3 max-h-10 hover:bg-teal-500 transition hover:text-white rounded-full bg-teal-300"
              type={'button'}
              onClick={() => {
                setSellingUnits([...sellingUnits, sellingUnits.length + 1]);
              }}
            >
              <FontAwesomeIcon icon={faPlus} size="lg" />
              Add Selling Unit
            </button>
          )}
          {sellingUnits.length !== 1 && (
            <button
              type="button"
              className={'flex bg-red-500 rounded-full max-h-10 gap-3 p-3 items-center text-white hover:bg-red-600 transition '}
              onClick={() => {
                let units = [...sellingUnits];
                units.pop();
                setSellingUnits(units);
              }}
            >
              <FontAwesomeIcon icon={faXmark} size="lg" />
              Remove Previous Selling Unit
            </button>
          )}
          {data?.units?.length === 1 && <span>Can&apos;t add because this product reach max unit.</span>}
        </div>
      </div>
      <div className="gap-5 flex justify-end items-center my-3">
        <button type="submit" className={'rounded-full px-3 py-2 max-h-[40px] flex gap-3 items-center bg-posblue hover:bg-teal-600 hover:text-white transition '} disabled={isLoading}>
          <FontAwesomeIcon icon={isLoading ? faSpinner : faBox} spin={isLoading} size="lg" />
          Create Product
        </button>
        <button type="reset" onClick={() => router.back()} className={'rounded-full px-3 py-2 max-h-[40px] flex gap-3 items-center bg-posgray hover:bg-gray-600 text-white transition '} disabled={isLoading}>
          <FontAwesomeIcon icon={faCaretLeft} size="lg" />
          Back
        </button>
      </div>
    </form>
  );
}
