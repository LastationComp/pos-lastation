import React from 'react';

export default function PosTable({ headers, children, fixed = true }: { headers: any[], children: React.ReactNode, fixed: boolean }) {
  return (
    <div className="overflow-x-auto shadow-lg ">
      <table className={`table-${fixed ? 'fixed' : 'auto'}  w-full `}>
        <thead className="bg-posgray font-semibold text-white">
          <tr>
            {headers.map((head, i) => (
              <th key={i} className="text-start p-3">
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="">{children}</tbody>
      </table>
    </div>
  );
}
