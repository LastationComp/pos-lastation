'use client';
import PosTable from '@/app/_components/PosTable';
import React, { useState } from 'react';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons/faUserPlus';
import PosButton from '@/app/_components/PosButton';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export const fetcher = (url: string) => fetch(url).then((res) => res.json());

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
      html: 'This option not make your employe <span class="text-blue-500">Activated</span> and can login to your bussiness',
      width: 800,
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton: true,
    }).then((res) => {
      if (res.isConfirmed) return handleActivate(id);
    });
  };
  return (
    <>
      <div className="text-lg font-semibold">Employees</div>
      <div className="flex justify-between items-center">
        <div className="rtl">
          <label className="relative inline-flex items-center me-5 cursor-pointer">
            <input type="checkbox" checked={showDeactive} className="sr-only peer" onChange={(e) => setShowDeactive(!showDeactive)} />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600"></div>
            <span className="ms-3 text-sm text-posgray">Show Inactive Employee Only</span>
          </label>
        </div>
        <div className="relative">
          <input type="text" className="rounded-full px-3 py-1 pr-8   outline outline-1 outline-posblue shadow-md " onChange={(e) => setQuery(e.target.value)} />
          <FontAwesomeIcon icon={faSearch} className="absolute right-2 top-2 " />
        </div>
        <PosButton icon={faUserPlus} onClick={() => router.push('employees/add')}>
          Add Employee
        </PosButton>
      </div>

      <PosTable auto={false} headers={['Employee Code', 'Name', 'Status', 'Action']}>
        {data &&
          data.employees
            .filter((emp: any) => {
              let filterActive = true;
              let filterQuery = true
              if (query !== '') {
                const regex = new RegExp(`${query.toLocaleLowerCase()}`, 'gi');
                filterQuery = regex.test(emp.name.toLocaleLowerCase());
              }
              filterActive = emp.is_active === true
              if (showDeactive) filterActive = !emp.is_active;
              return filterActive && filterQuery
            })
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
    </>
  );
}
