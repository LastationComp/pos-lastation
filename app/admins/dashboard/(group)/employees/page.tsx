import React from 'react';
import FilterEmployee from './filter-employee';
import SearchEmployee from './search-employee';
import AddEmployee from './add-employee';
import dynamic from 'next/dynamic';
import LoadingComponent from '@/app/_components/LoadingComponent';

const EmployeeTable = dynamic(() => import('./employee-table'), { ssr: false, loading: () => <LoadingComponent /> });
export default function AdminEmployeesPage() {
  return (
    <>
      <div className="flex flex-col justify-center mt-4 p-4 bg-white rounded-md shadow-lg">
        <div className="text-2xl font-semibold">List Employee</div>
        <div className="flex md:justify-between flex-col md:flex-row items-center">
          <div className="flex items-center gap-3">
            <div className="rtl">
              <div className="relative inline-flex items-center me-5 cursor-pointer">
                <FilterEmployee />
                <div className="ms-3 text-sm text-posgray">Show Inactive Employee Only</div>
              </div>
            </div>
          </div>

          <div className="flex md:flex-row flex-col justify-end items-center space-x-4">
            <div className="">
              <SearchEmployee />
            </div>

            <AddEmployee />
          </div>
        </div>

        <EmployeeTable />
      </div>
    </>
  );
}
