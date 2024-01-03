'use client';
import React, { useState } from 'react';
import PosButton from '@/app/_components/PosButton';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';
import { fetcher } from '@/app/_lib/Fetcher';
import LoadingComponent from '@/app/_components/LoadingComponent';
import nProgress from 'nprogress';
import { Chip, Input, Switch } from '@nextui-org/react';
import PosTableNew from '@/app/_lib/NextUiPos/PosTable';

export default function AdminEmployeesPage() {
  const router = useRouter();
  const [showDeactive, setShowDeactive] = useState(false);
  const [query, setQuery] = useState('');
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

  if (!data) return <LoadingComponent />;
  return (
    <>
      <div className="flex flex-col justify-center mt-4 p-4 bg-white rounded-md shadow-lg">
        <div className="text-2xl font-semibold">List Employee</div>
        <div className="flex md:justify-between flex-col md:flex-row items-center">
          <div className="flex items-center gap-3">
            <div className="rtl">
              <div className="relative inline-flex items-center me-5 cursor-pointer">
                <Switch isSelected={showDeactive} size="sm" onValueChange={() => setShowDeactive(!showDeactive)}></Switch>
                <div className="ms-3 text-sm text-posgray">Show Inactive Employee Only</div>
              </div>
            </div>
          </div>

          <div className="flex md:flex-row flex-col justify-end items-center space-x-4">
            <div className="">
              <Input
                type="search"
                onValueChange={(value) => setQuery(value)}
                startContent={<FontAwesomeIcon icon={faSearch} />}
                radius={'full'}
                size={'sm'}
                placeholder="Input name Employee"
                className="rounded-full outline outline-1 outline-posblue"
              />
            </div>

            <PosButton
              icon={faPlus}
              onClick={() => {
                router.push('employees/add');
                nProgress.start();
              }}
            >
              <p className="font-semibold">Add Employee</p>
            </PosButton>
          </div>
        </div>

        <PosTableNew columns={['Employee Code', 'Name', 'Status', 'Action']} data={employeeData()} />
      </div>
    </>
  );
}
