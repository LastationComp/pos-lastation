'use client'
import LoadingComponent from '@/app/_components/LoadingComponent';
import { fetcher } from '@/app/_lib/Fetcher';
import React from 'react'
import useSWR from 'swr';

export default function SellingUnitsEditPage({params}: {params: {id:string}}) {
  const {data} = useSWR(`/api/employee/sellingunits/${params.id}`, fetcher)

  if (!data) return <LoadingComponent />
  return (
    <>
      <h1 className="text-lg font-semibold">Edit Selling Unit</h1>

      <div className="grid grid-cols-3 gap-5">
        <div className="flex flex-col">
          <label htmlFor="select-unit">Unit</label>
          <select name="select_unit" id="select-unit"  className="rounded outline outline-1 outline-posblue">
            <option value="">tes</option>
            {data.units && data?.units.map((unit: any) => {
              <option key={unit.id} value={unit.id}>{unit.name}</option>
            })}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="stock">Stock</label>
          <input name="stock" type="number" id="stock" value={data?.selling_unit?.stock} className="rounded outline outline-1 outline-posblue px-3 py-1" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="price">Price</label>
          <input name="price" type="number" id="price" className="rounded outline outline-1 outline-posblue px-3 py-1" />
        </div>
      </div>
    </>
  );
}
