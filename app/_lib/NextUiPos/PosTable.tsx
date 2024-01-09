'use client';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from '@nextui-org/react';
import React from 'react';
import { generateHeaders } from './GenerateHeaderTable';
import { usePathname } from 'next/navigation';

export default function PosTableNew({ columns, data }: { columns: any[]; data: any[] }) {
  const generateColumn = generateHeaders(columns);
  const pathname = usePathname();
  const items = React.useMemo(() => {
    return data;
  }, [data]);

  return (
    <Table aria-labelledby={pathname} className="overflow-y-auto min-h-[500px]">
      <TableHeader aria-label={pathname} columns={generateColumn}>
        {(column) => (
          <TableColumn aria-label={column.label} className="bg-posgray text-white" key={column.key}>
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={'No Data Display'} items={items} isLoading={items.length === 0} loadingContent={'Loading data...'}>
        {(item: any) => (
          <TableRow aria-label={item.key} key={item.key} className="odd:bg-poslight even:bg-slate-200 ">
            {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
