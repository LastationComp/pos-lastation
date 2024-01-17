'use client';

import PosButton from '@/app/_components/PosButton';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import nProgress from 'nprogress';
import React from 'react';
import Swal from 'sweetalert2';

export default function ButtonAdd({ session }: { session: any }) {
  const router = useRouter();
  const handleAddProduct = () => {
    const checkCanCreate = session?.user?.permissions.emp_can_create;
    if (!checkCanCreate)
      return Swal.fire({
        icon: 'error',
        title: 'Permission Denied!',
        text: 'Please contact your Admin for more information.',
      });
    nProgress.start();
    return router.push('products/add');
  };
  return (
    <PosButton icon={faPlusCircle} onClick={handleAddProduct}>
      Add Product
    </PosButton>
  );
}
