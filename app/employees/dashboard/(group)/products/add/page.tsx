'use client';

import PosButton from '@/app/_components/PosButton';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { faBox } from '@fortawesome/free-solid-svg-icons/faBox';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons/faCaretLeft';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { BaseSyntheticEvent, useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function AddProductPage() {
  const session: any = useSession();
  const [units, setUnits]: any = useState([]);
  const [sellingUnits, setSellingUnits] = useState([1]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [errMsg, setErrMsg] = useState('');
  let dataSellingUnits: any[] = [];
  const getUnits = async () => {
    const res = await fetch('/api/employee/units', {
      cache: 'no-store',
    });
    const result = await res.json();
    setUnits(result.units);
  };

  const handleFilter = (data: any) => {
    return !data.is_selected;
  };

  const handleSelectedUnit = (value: string) => {};

  const handleSelectIsSmallest = (value: boolean, id: number) => {
    sellingUnits
      .filter((data: any) => Number(data) !== id)
      .forEach((data) => {
        const component = document.getElementById('chk-is-smallest-' + data) as any | null;
        if (component) {
          component.checked = false;
        }
      });
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

      setIsLoading(false)
      setErrMsg('')
    });
  };

  const handleSubmit = async (e: BaseSyntheticEvent) => {
    const formdata = new FormData(e.target);
    dataSellingUnits = [];
    sellingUnits.forEach((data) => {
      dataSellingUnits.push({
        unit_id: Number(formdata.get('unit-id-' + data)),
        is_smallest: formdata.get('is-smallest-' + data) === 'on' ? true : false,
        stock: Number(formdata.get('stock-product-' + data) ?? 0),
        price: Number(formdata.get('price-product-' + data) ?? 0),
      });
    });

    const data = {
      id: session?.data?.user?.id ?? '',
      license_key: session?.data?.user?.license_key ?? '',
      product_name: formdata.get('product_name') ?? '',
      barcode: formdata.get('barcode'),
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
  useEffect(() => {
    getUnits();
  }, []);
  return (
    <>
      <h1 className="font-bold text-xl">Add Product</h1>
      <form action="" method="post" onSubmit={showWarningAdd}>
        <div className="grid grid-cols-4 gap-3">
          {errMsg && <div className="col-span-4 bg-red-600 rounded text-white p-3">{errMsg}</div>}
          <div className="flex flex-col col-span-2">
            <label htmlFor="product-name">Product Name</label>
            <input type="text" name="product_name" placeholder="Input your product name" required className="rounded outline outline-1 outline-posblue px-3 py-1" id="product-name" />
          </div>
          <div className="flex flex-col col-span-2">
            <label htmlFor="barcode">Barcode</label>
            <input type="text" name="barcode" placeholder="Input your product barcode" required className="rounded outline outline-1 outline-posblue px-3 py-1" id="barcode" />
          </div>
          <div className="flex flex-col col-span-4">
            <span className="font-semibold">Selling Units</span>
          </div>
          {sellingUnits.map((data, i) => (
            <div key={i + 1} className="flex flex-col col-span-2 my-3 justify-center gap-3">
              <div className="flex flex-col w-full">
                <label htmlFor={'product-name-' + data}>Unit</label>
                <select name={'unit-id-' + data} id={'product-name-' + data} onChange={(e) => handleSelectedUnit(e.currentTarget.value)} className="rounded outline outline-1 outline-posblue px-3 py-1">
                  {units &&
                    units.filter(handleFilter).map((data: any) => (
                      <option value={data.id} key={data.id}>
                        {data.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex items-center gap-3 w-full">
                <input type="checkbox" name={'is-smallest-' + data} id={'chk-is-smallest-' + data} defaultChecked={data === 1} onChange={(e) => handleSelectIsSmallest(e.target.checked, data)} className="rounded p-2 w-5 h-5" />
                <label htmlFor={'chk-is-smallest-' + data}>Is Smallest</label>
              </div>
              <div className="flex flex-col col-span-1">
                <label htmlFor={'stock-product-' + data}>Stock</label>
                <input type="number" name={'stock-product-' + data} placeholder="Input your stock" required className="rounded outline outline-1 outline-posblue px-3 py-1" id={'stock-product-' + data} />
              </div>
              <div className="flex flex-col col-span-2">
                <label htmlFor={'price-product-' + data}>Price</label>
                <input type="number" name={'price-product-' + data} placeholder="Input your price" required className="rounded outline outline-1 outline-posblue px-3 py-1" id={'price-product-' + data} />
              </div>
            </div>
          ))}
          <div className="col-span-2 flex gap-3">
            {sellingUnits.length !== units.length && (
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
                Remove Selling Unit
              </button>
            )}
          </div>
        </div>
        <div className="gap-5 flex justify-end items-center">
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
    </>
  );
}
