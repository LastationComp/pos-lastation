"use client";

import LoadingComponent from "@/app/_components/LoadingComponent";
import PosButton from "@/app/_components/PosButton";
import PosTable from "@/app/_components/PosTable";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons/faArrowsRotate";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons/faCartShopping";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Swal from "sweetalert2";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DashboardEmployeePage() {
  const session: any = useSession();
  const { data, mutate } = useSWR(
    "/api/employee/products?license=" + session?.data?.user?.license_key,
    fetcher
  );
  const router = useRouter();

  const handleAddProduct = () => {
    const checkCanCreate = session?.data?.user?.permissions.emp_can_create;
    if (!checkCanCreate)
      return Swal.fire({
        icon: "error",
        title: "Permission Denied!",
        text: "Please contact your Admin for more information.",
      });

    router.push("dashboard/products");
  };

  if (!data) return <LoadingComponent />;
  return (
    <>
      <div className="mt-5">
        <div className="flex">
          <div className="w-[950px] h-[565px] rounded-md shadow-xl bg-white">
            <div className="flex justify-between items-center px-5 py-3">
              <h1 className="text-2xl font-bold">List Products</h1>
              <PosButton icon={faPlus} onClick={() => handleAddProduct()}>
                Add Product
              </PosButton>
            </div>
            <div className="W-full justify-between items-center px-5">
              <PosTable
                fixed
                headers={[
                  "NO",
                  "Barcode",
                  "Name",
                  "Smallest Unit",
                  "Created By",
                  "Action",
                ]}
              >
                {data &&
                  data.products.map((product: any, i: number) => (
                    <tr
                      key={i + 1}
                      className="odd:bg-poslight even:bg-slate-200 "
                    >
                      <td className="p-3">{i + 1}</td>
                      <td className="p-3">{product.barcode}</td>
                      <td className="p-3">{product.product_name}</td>
                      <td className="p-3">{product.smallest_selling_unit}</td>
                      <td className="p-3">{product.employee.name}</td>
                      <td className="p-3 flex justify-start gap-3">
                        <button className="bg-posblue text-white px-2 py-1 rounded">
                          <FontAwesomeIcon icon={faCartShopping} /> Pilih
                        </button>
                      </td>
                    </tr>
                  ))}
              </PosTable>
            </div>
          </div>
          <div className="flex flex-col w-[350px] h-[565px] rounded-md shadow-xl bg-white">
            <div className="flex justify-between items-center p-5">
              <p className="text-2xl font-bold">Detail Pesanan</p>
              <button type="button" className="text-black bg-gray-400 px-2 py-1 rounded-lg">
                <FontAwesomeIcon icon={faArrowsRotate} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
