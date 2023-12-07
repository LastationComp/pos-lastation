import React from 'react'

export default function AdminEmployeesPage() {
  return (
    <>
      <div>Ini Halaman Admin Employees</div>
      <div className="overflow-x-auto shadow-lg ">
        <table className=" table-auto  w-full ">
          <thead className="bg-indigo-700 text-white">
            <tr>
              <th className="text-start p-3">Song</th>
              <th className="text-start p-3">Artist</th>
              <th className="text-start p-3">Year</th>
            </tr>
          </thead>
          <tbody className="">
            <tr className="odd:bg-slate-300 even:bg-slate-100 ">
              <td className="p-3">The Sliding Mr. Bones (Next Stop, Pottersville)</td>
              <td className="p-3">Malcolm Lockyer</td>
              <td className="p-3">1961</td>
            </tr>
            <tr className="odd:bg-slate-300 even:bg-slate-100 ">
              <td className="p-3">The Sliding Mr. Bones (Next Stop, Pottersville)</td>
              <td className="p-3">Malcolm Lockyer</td>
              <td className="p-3">1961</td>
            </tr>
            <tr className="odd:bg-slate-300 even:bg-slate-100 ">
              <td className="p-3">The Sliding Mr. Bones (Next Stop, Pottersville)</td>
              <td className="p-3">Malcolm Lockyer</td>
              <td className="p-3">1961</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
