'use client';

import { fetcher } from '@/app/_lib/Fetcher';
import PosTableNew from '@/app/_lib/NextUiPos/PosTable';
import { Pagination } from '@nextui-org/react';
import { useRouter, useSearchParams } from 'next/navigation';
import nProgress from 'nprogress';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import useSWR from 'swr';

export default function UnitTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const { data, mutate } = useSWR(`/api/superadmin/units?q=${query}`, fetcher, {
    keepPreviousData: true,
  });

  const handleWarning = async (id: any, name: string) => {
    Swal.fire({
      title: 'Are You Sure?',
      text: `Are You Sure Want To Delete ${name}?`,
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton: true,
    }).then((res) => {
      if (res.isConfirmed) return handleDelete(id);
    });
  };

  const handleDelete = async (id: any) => {
    const res = await fetch('/api/superadmin/units/' + id, {
      method: 'DELETE',
    });

    if (res.ok && res.status == 200) {
      mutate(data);
    }
  };

  const getUnitData = () => {
    let dumpData: any[] = [];
    dumpData = data?.units.map((data: any, i: number) => {
      return {
        key: i + 1,
        no: i + 1,
        name: data.name,
        action: (
          <div>
            <button onClick={() => handleWarning(data.id, data.name)} className="font-medium text-red-600 dark:text-red-500 hover:underline pr-3">
              Delete
            </button>
            <button
              onClick={() => {
                nProgress.start();
                router.push('/superadmin/dashboard/units/' + data.id + '/edit');
              }}
              className="font-medium text-yellow-800 dark:text-yellow-600 hover:underline"
            >
              Edit
            </button>
          </div>
        ),
      };
    });
    return dumpData;
  };
  return (
    <>
      <PosTableNew columns={['NO', 'Name', 'Action']} data={getUnitData()} />
    </>
  );
}
