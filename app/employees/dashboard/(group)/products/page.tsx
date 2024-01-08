"use client";

import LoadingComponent from "@/app/_components/LoadingComponent";
import PosButton from "@/app/_components/PosButton";
import PosTable from "@/app/_components/PosTable";
import PosTableNew from "@/app/_lib/NextUiPos/PosTable";
import { faEye } from "@fortawesome/free-solid-svg-icons/faEye";
import { faPencil } from "@fortawesome/free-solid-svg-icons/faPencil";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons/faPlusCircle";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import nProgress from "nprogress";
import React, { useState } from "react";
import Swal from "sweetalert2";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
export default function ProductsPage() {
  const session: any = useSession();
  const [query, setQuery] = useState("");
  const [finalQuery, setFinalQuery] = useState("");
  const { data, mutate } = useSWR(
    `/api/employee/products?license=${session?.data?.user?.license_key}&q=${query}`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );
  const router = useRouter();

  const handleDelete = async (id: string) => {
    const res = await fetch("/api/employee/products/" + id, {
      method: "DELETE",
    });

    const result = await res.json();
    if (res.ok && res.status === 200) {
      mutate(data);
      return Swal.fire({
        icon: "success",
        title:
          '<span class="font-normal text-md">Product Successfully Deleted</span>',
      });
    }

    return Swal.fire({
      icon: "error",
      title: '<span class="font-normal text-md">Error Deleted</span>',
      text: result?.message,
    });
  };

  const showWarningdelete = (id: string, name: string) => {
    Swal.fire({
      icon: "warning",
      title: `<span class="font-normal text-md">Are you sure to delete <b>${name}</b>?</span>`,
      html: 'This will <b class="text-red-600">deleted all select unit in this product!</b>',
      width: 600,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Yes",
    }).then((res) => {
      if (res.isConfirmed) return handleDelete(id);
    });
  };

  const handleAddProduct = () => {
    const checkCanCreate = session?.data?.user?.permissions.emp_can_create;
    if (!checkCanCreate)
      return Swal.fire({
        icon: "error",
        title: "Permission Denied!",
        text: "Please contact your Admin for more information.",
      });

    router.push("products/add");
  };

  const handleEditProduct = (id: string) => {
    const checkCanUpdate = session?.data?.user?.permissions.emp_can_update;
    if (!checkCanUpdate)
      return Swal.fire({
        icon: "error",
        title: "Permission Denied!",
        text: "Please contact your Admin for more information.",
      });

    router.push("products/" + id + "/edit");
  };

  const handleDeleteProduct = (id: string, name: string) => {
    const checkCanDelete = session?.data?.user?.permissions.emp_can_delete;
    if (!checkCanDelete)
      return Swal.fire({
        icon: "error",
        title: "Permission Denied!",
        text: "Please contact your Admin for more information.",
      });

    return showWarningdelete(id, name);
  };

  const productData = () => {
    let newData: any[] = [];
    data?.products.map((product: any, i: number) => {
      newData.push({
        key: i + 1,
        no: i + 1,
        barcode: product.barcode,
        product_name: product.product_name,
        smallest_selling_unit: product.smallest_selling_unit,
        created_by: product.employee.name,
        action: (
          <div className="p-3 flex justify-start gap-3">
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded"
              onClick={() => {
                router.push("products/" + product.id + "/detail");
                nProgress.start();
              }}
            >
              <FontAwesomeIcon icon={faEye} />
            </button>
            <button
              className="bg-yellow-500 text-white px-2 py-1 rounded"
              onClick={() => {
                handleEditProduct(product.id);
                nProgress.start();
              }}
            >
              <FontAwesomeIcon icon={faPencil} />
            </button>
            <button
              className="bg-red-500 text-white px-2 py-1 rounded"
              onClick={() =>
                handleDeleteProduct(product.id, product.product_name)
              }
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        ),
      });
    });
    return newData;
  };

  // if (!data) return <LoadingComponent />;
  return (
    <>
      <div className="text-xl font-semibold">Products Lists</div>
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            placeholder="Type barcode or product name"
            className="rounded-full outline outline-1 outline-posblue px-3 py-1 "
          />
        </div>
        <div>
          <PosButton
            icon={faPlusCircle}
            onClick={() => {
              handleAddProduct();
              nProgress.start();
            }}
          >
            Add Product
          </PosButton>
        </div>
      </div>
      {/* <PosTable fixed headers={['NO', 'Barcode', 'Name', 'Smallest Unit', 'Created By', 'Action']}>
        {data &&
          data.products.map((product: any, i: number) => (
            <tr key={i + 1} className="odd:bg-white even:bg-slate-200 ">
              <td className="p-3">{i + 1}</td>
              <td className="p-3">{product.barcode}</td>
              <td className="p-3">{product.product_name}</td>
              <td className="p-3">{product.smallest_selling_unit}</td>
              <td className="p-3">{product.employee.name}</td>
              <td className="p-3 flex justify-start gap-3">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() => {
                    router.push('products/' + product.id + '/detail');
                    nProgress.start();
                  }}
                >
                  <FontAwesomeIcon icon={faEye} />
                </button>
                <button className="bg-yellow-500 text-white px-2 py-1 rounded" onClick={() => {handleEditProduct(product.id); nProgress.start()}}>
                  <FontAwesomeIcon icon={faPencil} />
                </button>
                <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDeleteProduct(product.id, product.product_name)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
      </PosTable> */}
      <PosTableNew
        columns={[
          "Barcode",
          "Product Name",
          "Smallest Selling Unit",
          "Created By",
          "Action",
        ]}
        data={productData()}
      />
    </>
  );
}
