'use client';

import LoadingComponent from '@/app/_components/LoadingComponent';
import { fetcher } from '@/app/_lib/Fetcher';
import PosTableNew from '@/app/_lib/NextUiPos/PosTable';
import { faEye, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Tooltip } from '@nextui-org/react';
import { useRouter, useSearchParams } from 'next/navigation';
import nProgress from 'nprogress';
import React from 'react';
import Swal from 'sweetalert2';
import useSWR from 'swr';

export default function ProductsTable({ session }: { session: any }) {
  const searchParams = useSearchParams();
  const { data, mutate } = useSWR(`/api/employee/products?license=${session?.user?.license_key}&q=${searchParams.get('q') ?? ''}`, fetcher, {
    keepPreviousData: true,
  });
  const router = useRouter();
  const handleDelete = async (id: string) => {
    const res = await fetch('/api/employee/products/' + id, {
      method: 'DELETE',
    });

    const result = await res.json();
    if (res.ok && res.status === 200) {
      mutate(data);
      return Swal.fire({
        icon: 'success',
        title: '<span class="font-normal text-md">Product Successfully Deleted</span>',
      });
    }

    return Swal.fire({
      icon: 'error',
      title: '<span class="font-normal text-md">Error Deleted</span>',
      text: result?.message,
    });
  };

  const showWarningdelete = (id: string, name: string) => {
    Swal.fire({
      icon: 'warning',
      title: `<span class="font-normal text-md">Are you sure to delete <b>${name}</b>?</span>`,
      html: 'This will <b class="text-red-600">deleted all select unit in this product!</b>',
      width: 600,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Yes',
    }).then((res) => {
      if (res.isConfirmed) return handleDelete(id);
    });
  };

  const handleEditProduct = (id: string) => {
    const checkCanUpdate = session?.user?.permissions.emp_can_update;
    if (!checkCanUpdate)
      return Swal.fire({
        icon: 'error',
        title: 'Permission Denied!',
        text: 'Please contact your Admin for more information.',
      });

    nProgress.start();
    return router.push('products/' + id + '/edit');
  };

  const handleDeleteProduct = (id: string, name: string) => {
    const checkCanDelete = session?.user?.permissions.emp_can_delete;
    if (!checkCanDelete)
      return Swal.fire({
        icon: 'error',
        title: 'Permission Denied!',
        text: 'Please contact your Admin for more information.',
      });

    return showWarningdelete(id, name);
  };

  const productData = () => {
    let newData = data?.products.map((product: any, i: number) => {
      return {
        key: i + 1,
        no: i + 1,
        barcode: product.barcode,
        product_name: product.product_name,
        smallest_selling_unit: product.smallest_selling_unit,
        created_by: product.employee.name,
        action: (
          <div className="p-3 flex justify-start gap-3">
            <Tooltip content="Detail" showArrow placement={'left'} color={'primary'}>
              <Button
                isIconOnly
                size={'sm'}
                color={'primary'}
                onClick={() => {
                  nProgress.start();
                  router.push('products/' + product.id + '/detail');
                }}
              >
                <FontAwesomeIcon icon={faEye} />
              </Button>
            </Tooltip>
            <Tooltip content="Edit" placement={'top'} showArrow color={'warning'}>
              <Button
                isIconOnly
                size={'sm'}
                color={'warning'}
                onClick={() => {
                  handleEditProduct(product.id);
                }}
              >
                <FontAwesomeIcon icon={faPencil} />
              </Button>
            </Tooltip>
            <Tooltip content={'Delete'} showArrow placement={'right'} color={'danger'}>
              <Button isIconOnly size={'sm'} color={'danger'} onClick={() => handleDeleteProduct(product.id, product.product_name)}>
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </Tooltip>
          </div>
        ),
      };
    });
    return newData;
  };
  if (!data) return <LoadingComponent />;
  return <PosTableNew columns={['Barcode', 'Product Name', 'Smallest Selling Unit', 'Created By', 'Action']} data={productData()} />;
}
