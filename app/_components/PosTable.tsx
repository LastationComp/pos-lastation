import React from 'react';

export default function PosTable({ headers, children }: { headers: any[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto shadow-lg ">
      <table className=" table-auto  w-full ">
        <thead className="bg-posgray font-semibold text-white">
          <tr>
            {headers.map((head, i) => (
              <th key={i} className="text-start p-3">{head}</th>
            ))}
          </tr>
        </thead>
        <tbody className="">{children}</tbody>
      </table>
    </div>
  );
}
