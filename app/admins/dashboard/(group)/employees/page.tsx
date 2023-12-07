'use client'
import PosTable from '@/app/_components/PosTable';
import React from 'react';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons/faUserPlus';
import PosButton from '@/app/_components/PosButton';
import { useRouter } from 'next/navigation';

export default function AdminEmployeesPage() {
  const router = useRouter()
  return (
    <>
      <div className="text-lg font-semibold">Employees</div>

      <PosButton icon={faUserPlus} onClick={() => router.push('employees/add')}>
        Add Employee
      </PosButton>
      <PosTable headers={['Employee Code', 'Name', 'Status', 'Action']}>
        <tr className="odd:bg-poslight even:bg-slate-200 ">
          <td className="p-3">The Sliding Mr. Bones (Next Stop, Pottersville)</td>
          <td className="p-3">Malcolm Lockyer</td>
          <td className="p-3">1961</td>
          <td>Button</td>
        </tr>
        <tr className="odd:bg-poslight even:bg-slate-200 ">
          <td className="p-3">The Sliding Mr. Bones (Next Stop, Pottersville)</td>
          <td className="p-3">Malcolm Lockyer</td>
          <td className="p-3">1961</td>
          <td>Button</td>
        </tr>
      </PosTable>
    </>
  );
}
