'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import Swal from 'sweetalert2';
import { fetcher } from '@/app/_lib/Fetcher';
import { Chip } from '@nextui-org/react';
import PosTableNew from '@/app/_lib/NextUiPos/PosTable';

export default function EmployeeTable() {
  const searchParams = useSearchParams();
  const showDeactive: boolean = Boolean(Number(searchParams.get('show'))) ?? false;
  const query = searchParams.get('q') ?? '';
  const { data, mutate } = useSWR('/api/admins/employees', fetcher);
  const handleDeactive = async (id: string) => {
    const res = await fetch(`/api/admins/employees/${id}`, {
      method: 'DELETE',
    });

    if (res.ok && res.status === 200) return mutate(data);
  };

  const handleActivate = async (id: string) => {
    const res = await fetch(`/api/admins/employees/${id}`, {
      method: 'PUT',
    });

    if (res.ok && res.status === 200) return mutate(data);
  };
  const handleWarning = (name: string, id: string, isDeactivated: boolean = true) => {
    if (isDeactivated)
      return Swal.fire({
        title: `<span>Are you sure to deactive ${name}?</span>`,
        html: 'This option not make your employe deleted, but <span class="text-red-600">Deactivated</span>',
        width: 800,
        icon: 'warning',
        showCancelButton: true,
        showConfirmButton: true,
      }).then((res) => {
        if (res.isConfirmed) return handleDeactive(id);
      });

    return Swal.fire({
      title: `<span>Are you sure to Activate ${name}?</span>`,
      html: 'This option make your employe <span class="text-blue-500">Activated</span> and can login to your bussiness',
      width: 800,
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton: true,
    }).then((res) => {
      if (res.isConfirmed) return handleActivate(id);
    });
  };

  const filterEmployee = (emp: any) => {
    let filterActive = true;
    let filterQuery = true;
    if (query !== '') {
      const regex = new RegExp(`${query.toLocaleLowerCase()}`, 'gi');
      filterQuery = regex.test(emp.name.toLocaleLowerCase());
    }
    filterActive = emp.is_active === true;
    if (showDeactive) filterActive = !emp.is_active;
    return filterActive && filterQuery;
  };

  const employeeData = () => {
    let newData: any[] = [];
    data?.employees
      .filter((emp: any) => filterEmployee(emp))
      .map((emp: any, i: number) => {
        newData.push({
          key: i + 1,
          no: i + 1,
          employee_code: emp.employee_code,
          name: emp.name,
          status: emp.is_active ? (
            <Chip color="success" variant="flat">
              Active
            </Chip>
          ) : (
            <Chip color="danger" variant="flat">
              Inactive
            </Chip>
          ),
          action: emp.is_active ? (
            <button className="underline underline-1 underline-red-500 text-red-500" onClick={() => handleWarning(emp.name, emp.id)}>
              Deactive
            </button>
          ) : (
            <button className="underline underline-1 underline-blue-500 text-blue-500" onClick={() => handleWarning(emp.name, emp.id, false)}>
              Activate
            </button>
          ),
        });
      });

    return newData;
  };
  return <PosTableNew columns={['Employee Code', 'Name', 'Status', 'Action']} data={employeeData()} />;
}
