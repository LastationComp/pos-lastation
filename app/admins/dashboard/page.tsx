"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign, faUsersSlash, faUsers } from '@fortawesome/free-solid-svg-icons';
import { useSession } from "next-auth/react";
import PosTable from "@/app/_components/PosTable";
import useSWR from "swr";
import LoadingComponent from "@/app/_components/LoadingComponent";
import { formatRupiah } from "@/app/_lib/RupiahFormat";
import { formatDate, formatDateOnly } from "@/app/_lib/DateFormat";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminDashboardPage() {
  const session: any = useSession();
  const { data } = useSWR(
    "/api/employee/products?license=" + session?.data?.user?.license_key,
    fetcher
  );

  const getDashboard = () => {
    const id = session?.data?.user?.id
    const {data} = useSWR(`/api/admins/dashboard/${id}`, fetcher)
    return data
  }

  const dataDashboard = getDashboard()
  

  if(!data) return (
    <LoadingComponent/>
  )
  return (
    <>
      <div className="flex flex-row">
        <div className="flex flex-col justify-start items-start w-1/2 mx-2">
          <div className="w-full">
            <div className="relative w-full px-5 py-6 bg-white shadow-xl rounded-lg">
              <p className="text-2xl font-bold  ">{dataDashboard?.total_emp_active}</p>
              <p className="text-sm ">Employee Active</p>
              <span className="absolute p-5 bg-teal-300 rounded-full top-4 right-4">
                <div className="absolute  transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                  <FontAwesomeIcon icon={faUsers} />
                </div>
              </span>
            </div>
          </div>
          <div className="w-full mt-2">
            <div className="relative w-full px-5 py-6 bg-white shadow-lg rounded-lg">
              <p className="text-2xl font-bold ">{dataDashboard?.total_emp_nonactive}</p>
              <p className="text-sm ">Employee Deactive</p>
              <span className="absolute p-5 bg-red-400 rounded-full top-4 right-4">
                <div className="absolute  transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                  <FontAwesomeIcon icon={faUsersSlash} />
                </div>
              </span>
            </div>
          </div>
        </div>
        <div className="relative w-1/2 ml-4 bg-white shadow-xl rounded-lg">
          <div className="">
            <div className="flex items-start px-5">
              <div className="flex justify-between w-full p-3">
                <p className="ml-2 text-xl font-semibold">Transaction</p>
                <p className="mr-2 text-lg font-semibold">Total Income</p>
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center">
                <span className="relative p-6 bg-orange-300 rounded-md">
                  <div className="absolute h-6 text-white transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                    <FontAwesomeIcon icon={faDollarSign} />
                  </div>
                </span>
                <div className="flex flex-col text-black ml-2">
                  <p className="text-sm font-semibold">Today</p>
                  <p className="text-xs font-medium">Total transaction</p>
                </div>
              </div>
              <div className="flex flex-col justify-end items-end mr-2">
                <p className="mr-4 text-xl font-bold ">{formatRupiah(dataDashboard?.total_transactions_today.total_price)}</p>
                <p className="mr-4 text-sm font-medium ">{dataDashboard?.total_transactions_today.total_trx}</p>
              </div>
            </div>
            <div className="mx-6 border-b border-gray-300"></div>
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center">
                <span className="relative p-6 bg-orange-300 rounded-md">
                  <div className="absolute h-6 text-white transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                    <FontAwesomeIcon icon={faDollarSign} />
                  </div>
                </span>
                <div className="flex flex-col ml-2">
                  <p className="ml-2 text-sm font-semibold">Monthly</p>
                  <p className="ml-2 text-xs font-medium">Total transaction</p>
                </div>
              </div>
              <div className="flex flex-col justify-end items-end mr-2">
                <p className="mr-4 text-xl font-bold">{formatRupiah(dataDashboard?.total_transactions_monthly.total_price)}</p>
                <p className="mr-4 text-sm font-medium">{dataDashboard?.total_transactions_monthly.total_trx}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center mt-4 p-4 bg-white rounded-md shadow-lg">
        <div className="flex justify-start items-center w-full px-5 py-3"></div>
        <div className="flex justify-between items-center w-full p-5">
          <p className="text-2xl font-bold">Sales History</p>
          {/* <div className="relative flex justify-end items-center">
            <input type="text" className="rounded-full h-[45px] px-3 py-2 pr-8 outline outline-1 outline-posblue" name="" id="" placeholder="Input no references" />
            <FontAwesomeIcon icon={faSearch} className="absolute right-5 top-4 " />
          </div> */}
        </div>
        <div className="w-full justify-beetwen items-center px-5">
          <PosTable fixed headers={['NO References', 'Date', 'Employee', 'Total']}>
            {dataDashboard?.transactions &&
              dataDashboard?.transactions.map((trx: any, i: number) => (
                <tr key={trx.no_ref} className="odd:bg-poslight even:bg-slate-200 ">
                  <td className="p-3">{trx.no_ref}</td>
                  <td className="p-3">{formatDate(trx.created_at)}</td>
                  <td className="p-3">{trx.employee.name}</td>
                  <td className="p-3">{formatRupiah(trx.total_price)}</td>
                  {/* <td className="p-3 flex justify-start gap-3">
                    <button className="bg-posblue text-white px-2 py-1 rounded">
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  </td> */}
                </tr>
              ))}
          </PosTable>
        </div>
      </div>
    </>
  );
}
