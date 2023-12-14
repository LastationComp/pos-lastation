'use client';
import React, { BaseSyntheticEvent, useEffect, useRef, useState } from 'react';
import PosButton from '../../PosButton';
import { useRouter } from 'next/navigation';
import { faRotate } from '@fortawesome/free-solid-svg-icons/faRotate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons/faUsers';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { faMinus } from '@fortawesome/free-solid-svg-icons/faMinus';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { Products } from '@prisma/client';
import Swal from 'sweetalert2';

export default function TransactionLists({ transactions, setTransaction, session, mutate }: { transactions: any[]; setTransaction: any; session: any; mutate: any }) {
  const router = useRouter();
  const [showPrint, setShowPrint] = useState(false);
  const [member, setMember]: any = useState();
  const [buttonType, setButtonType] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [pay, setPay] = useState(0);
  const [payBack, setPayBack] = useState(0);
  const [openPayment, setOpenPayment] = useState(false);
  const [openMember, setOpenMember] = useState(false);
  const [isPendingMember, setIsPendingMember] = useState(false);
  const [errMember, setErrMember] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const handleDelete = (id: string) => {
    let result = transactions.findIndex((res: Products) => res.id === id);
    let transaction = [...transactions];
    transaction.splice(result, 1);
    setTransaction(transaction);
  };

  const updateTransaction = (id: string, data: any) => {
    const trans = transactions.map((prod) => {
      if (prod.id === id) {
        return {
          ...prod,
          ...data,
        };
      }
      return prod;
    });
    setTransaction(trans);
  };

  const calTotalPrice = () => {
    let result = 0;
    transactions.forEach((trx) => {
      result += trx.total_price;
    });
    setTotalPrice(Math.round(result));
  };

  const handleCheckCustomer = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    setErrMember('');
    const formData = new FormData(e.currentTarget);
    const res = await fetch(`/api/employee/members/${formData.get('customer_code')}/check?license=${session?.user?.license_key}`, {
      cache: 'no-store',
    });

    const result = await res.json();

    if (!res.ok && res.status !== 200) return setErrMember(result?.message);

    setMember(result?.customer);
    return setOpenMember(false);
  };

  const handleCreateTransaction = async (e: BaseSyntheticEvent) => {
    setErrMsg('');

    let selling_units: any = [];
    transactions.forEach((trx) => {
      selling_units.push({
        selling_unit_id: trx.sel_id,
        qty: Number(trx.qty),
        total_price: trx.total_price,
      });
    });

    const formData = {
      license_key: session?.user?.license_key ?? '',
      id: session?.user?.id ?? null,
      customer_id: member?.id ?? null,
      pay: pay,
      change: payBack,
      total_price: totalPrice,
      selling_units: selling_units,
    };

    const res = await fetch(`/api/employee/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result = await res.json();
    if (!res.ok && res.status !== 200) {
      setOpenPayment(false);
      return setErrMsg(result?.message);
    }

    Swal.fire({
      icon: 'success',
      title: result?.message,
    }).then((res) => {
      clearTransactions();
    });
  };

  const checkValidationPayment = (e: BaseSyntheticEvent) => {
    e.preventDefault();
    setErrMsg('');
    if (buttonType === 'subpay') {
      if (transactions.length === 0) return;
      return setOpenPayment(true);
    }

    return handleCreateTransaction(e);
  };

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(number);
  };

  const clearTransactions = () => {
    setMember();
    setTransaction([]);
    setOpenMember(false);
    setOpenPayment(false);
    setErrMember('');
    setErrMsg('');
    setPay(0);
    setPayBack(0);
    mutate();
  };

  useEffect(() => {
    calTotalPrice()
  }, [transactions]);


  return (
    <>
      <div className={'absolute inset-0 z-999 h-screen ' + (showPrint ? 'block' : 'hidden')}>
        {/* <div
          id="bg-drop-print"
          onClick={(e) => {
            const popover = document.getElementById('printout') as HTMLDivElement;
            if (!popover.contains(e.target as any)) return setShowPrint(false);
          }}
          className={'flex justify-center items-center h-full mx-auto backdrop-blur-sm bg-white/30 '}
        >
          <div id="printout" className="wrapper w-[400px] h-auto bg-gray-200 shadow-drop-md rounded">
            <div className="flex flex-col">
              <div className="flex justify-center mt-5">
                <div className="flex gap-1">
                  <div className="flex flex-col">
                    <h1 className="flex justify-center text-sm font-semibold">{session?.user?.client_name}</h1>
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-2">
                <div className="grid grid-rows-2 grid-flow-col gap-x-12 gap-y-1">
                  <div className="text-xs font-semibold">Kasir : {session?.user?.name}</div>
                  <div className="text-xs font-semibold">Waktu : {new Date().toLocaleDateString()}</div>
                  <div className="text-xs font-semibold">Member : {member?.name ?? '-'}</div>
                  <div className="text-xs font-semibold flex justify-center">{new Date().toLocaleTimeString()}</div>
                </div>
              </div>
              <div className="p-5">
                <table className="w-full table-auto">
                  <thead className="border border-x-0 border-y-2 border-dashed border-black">
                    <tr>
                      <th className="text-start text-xs py-2 w-1/3">Produk</th>
                      <th className="text-center text-xs">Qty</th>
                      <th className="text-center text-xs">Harga</th>
                      <th className="text-center text-xs">Total</th>
                    </tr>
                  </thead>
                  <tbody className="border border-x-0 border-y-2 border-dashed border-black">
                    {transactions.map((trx) => (
                      <tr>
                        <td className="text-xs font-semibold py-2">{trx.product_name}</td>
                        <td className="text-center text-xs font-semibold py-2">{trx.qty}</td>
                        <td className="text-center text-xs font-semibold py-2">{formatRupiah(trx.price)}</td>
                        <td className="text-center text-xs font-semibold py-2">{formatRupiah(trx.total_price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="pt-2">
                  <h1 className="text-xs font-semibold py-1">Total : {formatRupiah(totalPrice)}</h1>
                  <h1 className="text-xs font-semibold py-1">Tunai : {formatRupiah(pay)}</h1>
                  <h1 className="text-xs font-semibold py-1">Kembali : {formatRupiah(payBack)}</h1>
                </div>
                <div className="border border-x-0 border-y-[1px] border-dashed border-black"></div>
                <div className="flex justify-center">
                  <h1 className="text-xs font-semibold text-center py-2">
                    Terima Kasih Atas Kunjungan Anda <br />
                    Periksa Barang sebelum dibeli <br />
                    note : Barang yang sudah dibeli tidak bisa ditukar
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
      <div className={'absolute inset-0 z-999 h-screen  ' + (openMember ? 'block' : 'hidden')}>
        <div
          id="bg-drop"
          onClick={(e) => {
            const popover = document.getElementById('popover-member') as HTMLDivElement;
            if (!popover.contains(e.target as any)) return setOpenMember(false);
          }}
          className="flex justify-center items-center h-full mx-auto backdrop-blur-sm bg-white/30"
        >
          <div id="popover-member" className="bg-white p-3 shadow-md rounded-md flex flex-col items-center w-[500px]">
            <span>Member</span>
            <form action="" method="post" onSubmit={handleCheckCustomer} className="w-full">
              {errMember && <div className="bg-red-600 rounded p-3 text-white my-3">{errMember}</div>}
              <div className="w-full flex gap-3">
                <input type="text" name="customer_code" required placeholder="Input Customer Code..." className="w-full outline outline-1 outline-posblue rounded px-3 py-2" />
                <button type="submit" className="bg-posblue px-3 py-2 rounded">
                  Search
                </button>
              </div>
              <div className="w-full">
                <button
                  type="reset"
                  className="bg-red-600 rounded text-center flex justify-end text-white px-3 py-2 my-3 mx-auto"
                  onClick={() => {
                    setOpenMember(false);
                    setMember();
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <h1 className="text-[24px] font-bold">Order Details</h1>
        <button className="p-2 bg-gray-300 rounded" onClick={() => clearTransactions()}>
          <FontAwesomeIcon icon={faRotate} size="lg" />
        </button>
      </div>
      <div className="flex gap-3">
        <button className="p-3 bg-gray-300 rounded" onClick={() => setOpenMember(true)}>
          <FontAwesomeIcon icon={faUsers} size="2xl" />
        </button>

        <div className="flex-col justify-center items-center">
          <div>
            <span className="text-lg font-semibold">{member?.name ?? 'General'}</span>
          </div>
          <div>
            <span>{member?.customer_code ?? '-'}</span>
          </div>
        </div>
      </div>
      <form action="" method="post" onSubmit={checkValidationPayment}>
        <div className={'absolute inset-0 z-999 h-screen  ' + (openPayment ? 'block' : 'hidden')}>
          <div
            id="bg-drop"
            onClick={(e) => {
              const popover = document.getElementById('popover-payment') as HTMLDivElement;
              if (!popover.contains(e.target as any)) return setOpenPayment(false);
            }}
            className="flex justify-center items-center h-full mx-auto backdrop-blur-sm bg-white/30"
          >
            <div id="popover-payment" className="bg-white p-3 shadow-md rounded-md flex flex-col items-center w-[500px]">
              <span>Detail Payment</span>
              <div className="w-full  flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <label htmlFor="total_price">Total Price</label>
                  <input type="text" name="total_price" value={formatRupiah(totalPrice)} required placeholder="Subtotal" disabled className=" w-1/2 outline outline-1 outline-posblue rounded px-3 py-2" />
                </div>
                <div className="flex justify-between items-center">
                  <label htmlFor="pay">Pay</label>
                  <input
                    type="text"
                    name="pay"
                    value={pay}
                    required
                    onChange={(e) => {
                      setPay(Number(e.target.value));
                      setPayBack(Number(e.target.value) - totalPrice);
                    }}
                    placeholder="Input your pay"
                    className=" w-1/2 outline outline-1 outline-posblue rounded px-3 py-2"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <label htmlFor="payback">Payback</label>
                  <input type="text" name="payback" value={formatRupiah(payBack)} required placeholder="Result your payback" disabled className=" w-1/2 outline outline-1 outline-posblue rounded px-3 py-2" />
                </div>
              </div>
              <div className="w-full flex justify-end mx-auto my-3 gap-3">
                <button
                  type="button"
                  className="bg-red-600 rounded text-center text-white px-3 py-2 "
                  onClick={() => {
                    setOpenPayment(false);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" onClick={() => setButtonType('ispay')} className="rounded bg-posblue px-3 py-1" name="ispay">
                  Pay
                </button>
              </div>
            </div>
          </div>
        </div>
        {errMsg && <div className="bg-red-600 my-3 p-3 rounded-full text-white">{errMsg}</div>}
        <div className="flex flex-col gap-2 my-3 overflow-y-auto h-[600px] p-2">
          {transactions.length === 0 && <div className="bg-yellow-300 p-3 rounded-full">Please Select a Product!</div>}
          {transactions &&
            transactions.map((trx: any, i: number) => {
              trx.qty = trx.qty ?? 1;
              trx.sel_id = trx.sel_id ?? '';
              trx.price = trx.price ?? 0;
              trx.total_price = trx.total_price ?? 0;
              const removeItem = () => {
                updateTransaction(trx.id, {
                  qty: 1,
                  sel_id: '',
                  price: 0,
                  total_price: 0,
                });
                handleDelete(trx.id);
              };

              return (
                <div key={trx.id} className="p-3 outline outline-1 outline-gray-300 rounded">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label htmlFor={'select-trx-' + trx.id} className="text-lg font-semibold">
                        {trx.product_name}
                      </label>
                      <button className="px-3 py-2 bg-red-600 text-white rounded" onClick={() => removeItem()}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                    <div className="flex justify-between">
                      <select
                        required
                        name={'selling-unit-' + trx.id}
                        onChange={(e) => {
                          const selling_unit = e.target.value.toString().split(',');
                          updateTransaction(trx.id, {
                            sel_id: selling_unit[0] ?? '',
                            price: selling_unit[1] ?? 0,
                            total_price: Number(selling_unit[1] ?? 0) * trx.qty,
                          });
                        }}
                        value={trx.sel_id + ',' + trx.price}
                        className="outline outline-1 w-1/2 outline-gray-300 rounded"
                        id={'select-trx-' + trx.id}
                      >
                        <option value="">Select Unit</option>
                        {trx?.sellingUnits &&
                          trx?.sellingUnits.map((slu: any, i: number) => (
                            <option key={i} value={slu.id + ',' + slu.price}>
                              {slu?.unit?.name}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>
                        {formatRupiah(Math.round(trx.total_price))}
                        <input type="number" name={'price-' + trx.id} value={Math.round(trx.total_price)} className="outline hidden outline-0 bg-white" disabled id={'price-' + trx.id} />
                      </span>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          className="px-2 py-1 bg-gray-300 rounded"
                          onClick={() => {
                            const result = trx.qty - 1;
                            if (result < 1) return removeItem();

                            updateTransaction(trx.id, {
                              qty: result,
                              total_price: trx.price * result,
                            });
                          }}
                        >
                          <FontAwesomeIcon icon={faMinus} />
                        </button>
                        <input
                          type="number"
                          name={'qty-' + trx.id}
                          value={trx.qty}
                          onChange={(e) => {
                            if (Number(e.target.value) <= 0) return removeItem();
                            updateTransaction(trx.id, {
                              qty: e.target.value,
                              total_price: trx.price * Number(e.target.value),
                            });
                          }}
                          className="outline outline-1 outline-gray-300 rounded text-center w-[50px]"
                          id={'qty-' + trx.id}
                        />
                        <button
                          type="button"
                          className="px-2 py-1 bg-gray-300 rounded"
                          onClick={() => {
                            const result = trx.qty + 1;
                            updateTransaction(trx.id, {
                              qty: result,
                              total_price: trx.price * result,
                            });
                          }}
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="flex justify-between mt-auto bg-gray-300 items-center rounded">
          <span className="mx-3">Subtotal: {formatRupiah(totalPrice)}</span>
          <button name="subpay" onClick={() => {setButtonType('subpay');  setPayBack(Number(pay) - totalPrice);}} className="bg-posblue rounded-r p-3" type="submit">
            Pay
          </button>
        </div>
      </form>
    </>
  );
}
