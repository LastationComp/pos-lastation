'use client';
import PosTable from '@/app/_components/PosTable';
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
import { Switch } from '@nextui-org/react';



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
  }
  if(!data) return (
    <LoadingComponent/>
  )
  return (
    <>
      <div className="flex flex-col justify-center mt-4 p-4 bg-white rounded-md shadow-lg">
        <div className="text-2xl font-semibold">List Employee</div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="rtl">
              <label className="relative inline-flex items-center me-5 cursor-pointer" htmlFor="chk_emp_can_login">
                <Switch isSelected={showDeactive} size='sm' onValueChange={() => setShowDeactive(!showDeactive)}></Switch>
                <div className="ms-3 text-sm text-posgray">Show Inactive Employee Only</div>
              </label>
            </div>
          </div>

          <div className="flex justify-end items-center space-x-4">
            <div className="relative flex items-center">
              <input type="text" className="rounded-full h-[45px] px-3 py-2 pr-8   outline outline-1 outline-posblue shadow-md " onChange={(e) => setQuery(e.target.value)} placeholder="Input name member" />
              <FontAwesomeIcon icon={faSearch} className="absolute right-5 top-4 " />
            </div>
            <PosButton icon={faPlus} onClick={() => {
              router.push('employees/add')
              nProgress.start()
              }}>
              <p className="font-semibold">Add Employee</p>
            </PosButton>
          </div>
        </div>

        {data.employees.length !== 0 && (
          <PosTable fixed headers={['Employee Code', 'Name', 'Status', 'Action']}>
            {data &&
              data.employees
                .filter((emp: any) => filterEmployee(emp))
                .map((emp: any, i: number) => (
                  <tr key={i} className="odd:bg-poslight even:bg-slate-200 ">
                    <td className="p-3">{emp.employee_code}</td>
                    <td className="p-3">{emp.name}</td>
                    <td className="p-3">{emp.is_active ? 'Active' : <span className="text-red-500">Inactive</span>}</td>
                    <td className="p-3 flex gap-3">
                      {emp.is_active ? (
                        <button className="underline underline-1 underline-red-500 text-red-500" onClick={() => handleWarning(emp.name, emp.id)}>
                          Deactive
                        </button>
                      ) : (
                        <button className="underline underline-1 underline-blue-500 text-blue-500" onClick={() => handleWarning(emp.name, emp.id, false)}>
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
          </PosTable>
        )}
        {data.employees.filter((emp: any) => filterEmployee(emp)).length === 0 && <div className="text-center my-3">{!showDeactive ? "Empty Employee, click 'Add Employee' to add employee" : 'No Employee Inactive.'}</div>}
      </div>
    </>
  );
}
