'use client';

import { fetcher } from '@/app/_lib/Fetcher';
import { formatNumber } from '@/app/_lib/RupiahFormat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Skeleton } from '@nextui-org/react';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import React, { BaseSyntheticEvent, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import useSWR from 'swr';
import { faBox, faCaretLeft, faPlus, faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';

export default function FormAddProduct({ session }: { session: any }) {
  const { data } = useSWR('/api/employee/units', fetcher);
  const [sellingUnits, setSellingUnits] = useState([
    {
      id: uuidv4(),
      unit_id: '',
      is_smallest: true,
      stock: null,
      price: null,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [errMsg, setErrMsg] = useState('');

  const units: any[] = useMemo(() => {
    return data?.units ?? [];
  }, [data]);

  const updateSellingUnit = (id: string, newSU: any) => {
    const newData = sellingUnits.map((oldData) => {
      if (oldData.id === id)
        return {
          ...oldData,
          ...newSU,
        };
      return {
        ...oldData,
      };
    });
    setSellingUnits(newData);
  };

  const handleSelectIsSmallest = (value: boolean, id: string) => {
    const newSU = sellingUnits.map((oldData) => {
      if (oldData.id === id)
        return {
          ...oldData,
          is_smallest: value,
        };
      return {
        ...oldData,
        is_smallest: false,
      };
    });

    setSellingUnits(newSU);
  };

  const showWarningAdd = (e: BaseSyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrMsg('');
    Swal.fire({
      icon: 'warning',
      title: '<span class="text-md font-normal">Are you sure to create?</span>',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Yes',
    }).then((res) => {
      if (res.isConfirmed) return handleSubmit(e);

      setIsLoading(false);
      setErrMsg('');
    });
  };

  const handleSubmit = async (e: BaseSyntheticEvent) => {
    const formdata = new FormData(e.target);
    const dataSellingUnits = sellingUnits.map((data) => {
      return {
        unit_id: Number(data.unit_id) ?? null,
        is_smallest: data.is_smallest,
        stock: Number(data.stock),
        price: Number(data.price),
      };
    });

    const data = {
      id: session?.user?.id ?? '',
      license_key: session?.user?.license_key ?? '',
      product_name: formdata.get('product_name') ?? '',
      barcode: formdata.get('barcode') ?? '',
      dump_unit: units,
      selling_units: dataSellingUnits,
    };

    const res = await fetch('/api/employee/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    clearCondition();
    if (!res.ok && res.status !== 200) {
      return setErrMsg(result?.message);
    }
    if (res.ok) {
      return router.back();
    }
  };

  const clearCondition = () => {
    setIsLoading(false);
    setErrMsg('');
  };
  return (
    <form action="" method="post" onSubmit={showWarningAdd}>
      <div className="grid grid-cols-4 gap-3">
        {errMsg && <div className="col-span-4 bg-red-600 rounded text-white p-3">{errMsg}</div>}
        <div className="flex flex-col col-span-2 max-md:col-span-4">
          <label htmlFor="product-name">Product Name</label>
          <input type="text" name="product_name" placeholder="Input your product name" required className="rounded outline outline-1 outline-posblue px-3 py-1" id="product-name" />
        </div>
        <div className="flex flex-col col-span-2 max-md:col-span-4">
          <label htmlFor="barcode">Barcode</label>
          <input type="text" name="barcode" placeholder="Input your product barcode" required className="rounded outline outline-1 outline-posblue px-3 py-1" id="barcode" />
        </div>
        <div className="flex flex-col col-span-4">
          <span className="font-semibold">Selling Units</span>
        </div>
        {sellingUnits.map((data, i) => (
          <div key={i + 1} className="flex flex-col col-span-2 max-md:col-span-4 my-3 justify-center gap-3">
            <div className="flex flex-col w-full">
              <label htmlFor={'product-name-' + data.id}>Unit</label>
              <Skeleton className="rounded-md w-full p-1" isLoaded={units.length !== 0}>
                <select
                  name={'unit-id-' + data.id}
                  value={data.unit_id}
                  id={'product-name-' + data.id}
                  onChange={(e) =>
                    updateSellingUnit(data.id, {
                      unit_id: e.target.value,
                    })
                  }
                  className="rounded w-full outline outline-1 outline-posblue px-3 py-1"
                  required
                >
                  <option value="">Select Unit</option>
                  {units &&
                    units.map((data: any) => (
                      <option value={data.id} key={data.id}>
                        {data.name}
                      </option>
                    ))}
                </select>
              </Skeleton>
            </div>

            <div className="flex items-center gap-3 w-full">
              <input type="checkbox" name={'is-smallest-' + data.id} id={'chk-is-smallest-' + data.id} checked={data.is_smallest} onChange={(e) => handleSelectIsSmallest(e.target.checked, data.id)} className="rounded p-2 w-5 h-5" />
              <label htmlFor={'chk-is-smallest-' + data.id}>Is Smallest</label>
            </div>
            <div className="flex flex-col col-span-1">
              <label htmlFor={'stock-product-' + data.id}>Stock</label>
              <input
                type="number"
                name={'stock-product-' + data.id}
                value={data.stock ?? ''}
                onChange={(e) =>
                  updateSellingUnit(data.id, {
                    stock: e.target.value,
                  })
                }
                placeholder="Input your stock"
                required
                className="rounded outline outline-1 outline-posblue px-3 py-1"
                id={'stock-product-' + data.id}
              />
            </div>
            <div className="flex flex-col col-span-2">
              <label htmlFor={'price-product-' + data.id}>Price</label>
              <input
                type="number"
                name={'price-product-' + data.id}
                value={data.price ?? ''}
                onChange={(e) => {
                  updateSellingUnit(data.id, {
                    price: e.target.value,
                  });
                }}
                placeholder="Input your price"
                required
                className="rounded outline outline-1 outline-posblue px-3 py-1"
                id={'price-product-' + data.id}
              />
              <span className="text-sm text-black/40">Output: {formatNumber(data.price ?? 0)}</span>
            </div>
          </div>
        ))}
        <div className="col-span-2 max-md:col-span-4 flex max-lg:flex-col gap-3 border-dashed border-2 border-slate-600 rounded p-5 h-full items-center justify-center">
          {sellingUnits.length !== units.length && (
            <button
              className="flex items-center gap-3 p-3 max-h-10 hover:bg-teal-500 transition hover:text-white rounded-full bg-teal-300"
              type={'button'}
              onClick={() => {
                setSellingUnits([
                  ...sellingUnits,
                  {
                    id: uuidv4(),
                    unit_id: '',
                    is_smallest: false,
                    stock: null,
                    price: null,
                  },
                ]);
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
