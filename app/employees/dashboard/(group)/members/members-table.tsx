'use client';

import LoadingComponent from '@/app/_components/LoadingComponent';
import { fetcher } from '@/app/_lib/Fetcher';
import PosTableNew from '@/app/_lib/NextUiPos/PosTable';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Tooltip } from '@nextui-org/react';
import { useRouter, useSearchParams } from 'next/navigation';
import nProgress from 'nprogress';
import React from 'react';
import Swal from 'sweetalert2';
import useSWR from 'swr';

export default function MembersTable({ session }: { session: any }) {
  const searchParams = useSearchParams();
  const { data, mutate } = useSWR(`/api/employee/members?license=${session?.user?.license_key}&q=${searchParams.get('q') ?? ''}`, fetcher, {
    keepPreviousData: true,
  });

  const router = useRouter();

  const handleWarning = async (name: string, customer_code: string) => {
    Swal.fire({
      title: `Delete this member?`,
      text: `${name} (${customer_code})`,
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton: true,
    }).then((res) => {
      if (res.isConfirmed) return handleDelete(customer_code);
    });
  };

  const handleDelete = async (customer_code: string) => {
    const res = await fetch(`/api/employee/members/${customer_code}`, {
      method: 'DELETE',
    });

    if (!res.ok)
      return Swal.fire({
        title: `Failed to delete ${customer_code}`,
        icon: 'error',
      });

    mutate(data);

    Swal.fire({
      title: `${customer_code} Successfully Deleted!`,
      icon: 'success',
    });
  };
  const memberData = () => {
    let newData = data?.members.map((member: any, i: number) => {
      return {
        key: i + 1,
        no: i + 1,
        customer_code: member.customer_code,
        name: member.name,
        email: member.email,
        phone: member.phone,
        point: member.point,
        action: (
          <div className="flex gap-2">
            <Tooltip content={'Delete'} placement={'left'} color={'danger'} showArrow>
              <Button onClick={() => handleWarning(member.name, member.customer_code)} isIconOnly size={'sm'} color={'danger'}>
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </Tooltip>

            <Tooltip content={'Edit'} color="warning" placement={'right'} showArrow>
              <Button
                onClick={() => {
                  nProgress.start();
                  router.push(`/employees/dashboard/members/${member.customer_code.trim()}/edit`);
                }}
                isIconOnly
                size={'sm'}
                color={'warning'}
              >
                <FontAwesomeIcon icon={faPencil} />
              </Button>
            </Tooltip>
          </div>
        ),
      };
    });

    return newData;
  };
  if (!data) return <LoadingComponent />;
  return <PosTableNew columns={['Customer Code', 'Name', 'Email', 'Phone', 'Point', 'Action']} data={memberData()} />;
}
