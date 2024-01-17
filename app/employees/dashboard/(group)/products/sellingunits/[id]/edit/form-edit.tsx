'use client';

import { fetcher } from '@/app/_lib/Fetcher';
import { formatNumber } from '@/app/_lib/RupiahFormat';
import { faCaretLeft, faPencil, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Skeleton } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { BaseSyntheticEvent, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import useSWR from 'swr';

export default function FormEdit({ id }: { id: string }) {
  const { data } = useSWR(`/api/employee/sellingunits/${id}`, fetcher);
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [unitId, setUnitId] = useState('');
  const [unitName, setUnitName] = useState('');
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState(0);
  const router = useRouter();

  const handleSubmit = async (e: BaseSyntheticEvent) => {
    setIsLoading(true);
    const formData = new FormData(e.target);

    const form = {
      unit_id: Number(unitId),
      stock: Number(formData.get('stock')) ?? 0,
      price: Number(formData.get('price')) ?? 0,
      is_smallest: data?.selling_unit?.is_smallest ?? false,
      unit_name: unitName,
    };

    const res = await fetch(`/api/employee/sellingunits/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
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
      title: '<span class="text-md font-normal">Are you sure to save?</span>',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Yes',
    }).then((res) => {
      if (res.isConfirmed) return handleSubmit(e).then(() => setIsLoading(false));

      setIsLoading(false);
    });
  };

  useEffect(() => {
    setUnitId(data?.selling_unit?.unit_id ?? 0);
    setUnitName(data?.selling_unit?.unit?.name ?? '');
    setStock(data?.selling_unit?.stock ?? 0);
    setPrice(data?.selling_unit?.price ?? 0);
  }, [data]);
  return (
    <>
      {errMsg && <div className="bg-red-500 p-3 rounded text-white">{errMsg}</div>}
      <form action="" method="post" onSubmit={showWarning}>
        <div className="grid grid-cols-3 gap-5">
          <div className="flex flex-col col-span-3 md:col-span-1">
            <label htmlFor="select-unit">Unit</label>
            <Skeleton isLoaded={data?.units} className="p-1">
              <select
                name="select_unit"
                value={unitId + ',' + unitName}
                id="select-unit"
                onChange={(e) => {
                  const unit = e.target.value.split(',');
                  setUnitId(unit[0]);
                  setUnitName(unit[1]);
                }}
                className="rounded outline outline-1 outline-posblue py-1 w-full"
              >
                {data?.units &&
                  data?.units.map((unit: any) => (
                    <option key={unit.id + ',' + unit.name} value={unit.id + ',' + unit.name}>
                      {unit.name}
                    </option>
                  ))}
              </select>
            </Skeleton>
          </div>
          <div className="flex flex-col col-span-3 md:col-span-1">
            <label htmlFor="stock">Stock</label>
            <Skeleton isLoaded={data?.selling_unit} className="p-1">
              <input name="stock" type="number" id="stock" required value={stock} onChange={(e) => setStock(Number(e.target.value))} className="rounded w-full outline outline-1 outline-posblue px-3 py-1" />
            </Skeleton>
          </div>
          <div className="flex flex-col col-span-3 md:col-span-1">
            <label htmlFor="price">Price</label>
            <Skeleton isLoaded={data?.selling_unit} className="p-1">
              <input name="price" type="number" id="price" required value={price} onChange={(e) => setPrice(Number(e.target.value))} className="rounded w-full outline outline-1 outline-posblue px-3 py-1" />
              <span className="text-black/40">Output : {formatNumber(price) ?? 0}</span>
            </Skeleton>
          </div>
          <div className="col-span-3 flex justify-end gap-3">
            <button type="submit" className="bg-posblue hover:bg-teal-600 hover:text-white flex gap-3 items-center rounded-full px-3 py-2 transition">
              <FontAwesomeIcon icon={!isLoading ? faPencil : faSpinner} spin={isLoading} />
              Save
            </button>
            <button type="reset" onClick={() => router.back()} className="bg-posgray hover:bg-gray-600 text-white flex gap-3 items-center rounded-full px-3 py-2 transition">
              <FontAwesomeIcon icon={faCaretLeft} />
              Back
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
