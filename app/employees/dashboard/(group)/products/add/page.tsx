'use client';

import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { BaseSyntheticEvent, useEffect, useState } from 'react';

export default function AddProductPage() {
  const [units, setUnits]: any = useState([]);
  const [sellingUnits, setSellingUnits] = useState([1]);
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
    sellingUnits.filter((data: any) => Number(data) !== id).forEach((data) => {
      const component = document.getElementById('chk-is-smallest-' + data) as any | null;
      if (component) {
        component.checked = false
      }
    });
  };

  useEffect(() => {
    getUnits();
    // setSellingUnits(SUArray)
  }, []);
  return (
    <>
      <h1 className="font-bold text-xl">Add Product</h1>
      <form
        action=""
        method="post"
        onSubmit={(e) => {
          e.preventDefault();
          const formdata = new FormData(e.currentTarget);
          dataSellingUnits = [];
          sellingUnits.forEach((data) => {
            dataSellingUnits.push({
              unit_id: formdata.get('unit-id-' + data),
              is_smallest: formdata.get('is-smallest-' + data) === 'on' ? true : false,
              stock: Number(formdata.get('stock-product-' + data) ?? 0),
              price: Number(formdata.get('price-product-' + data) ?? 0),
            });
          });
          console.log(dataSellingUnits);
        }}
      >
        <div className="grid grid-cols-4 gap-3">
          <div className="flex flex-col col-span-2">
            <label htmlFor="product-name">Product Name</label>
            <input type="text" name="" placeholder="Input your product name" className="rounded outline outline-1 outline-posblue px-3 py-1" id="product-name" />
          </div>
          <div className="flex flex-col col-span-2">
            <label htmlFor="barcode">Barcode</label>
            <input type="text" name="" placeholder="Input your product barcode" className="rounded outline outline-1 outline-posblue px-3 py-1" id="barcode" />
          </div>
          <div className="flex flex-col col-span-4">
            <span className="font-semibold">Selling Units</span>
          </div>
          {sellingUnits.map((data, i) => (
            <div key={i + 1} className="flex flex-col col-span-2 justify-center gap-3">
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
                <input type="checkbox" name={'is-smallest-' + data} id={'chk-is-smallest-' + data} onChange={(e) => handleSelectIsSmallest(e.target.checked, data)} defaultChecked={false} className="rounded p-2 w-5 h-5" />
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
            {sellingUnits.length !== 1 && (
              <button
                type="button"
                className="flex bg-red-500 rounded-full max-h-10 gap-3 p-3 items-center text-white hover:bg-red-600 transition"
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
        <div className=" my-5">
          <button type="submit">Submit</button>
        </div>
      </form>
    </>
  );
}
