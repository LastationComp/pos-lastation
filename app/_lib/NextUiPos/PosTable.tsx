import { Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from '@nextui-org/react';
import React, { useMemo, useState } from 'react';
import { generateHeaders } from './GenerateHeaderTable';

export default function PosTableNew({ columns, data }: { columns: any[]; data: any[] }) {
  const generateColumn = generateHeaders(columns);

  const items = React.useMemo(() => {
    return data;
  }, [data]);

  return (
    <Table aria-label="Table New POS" className="overflow-y-auto min-h-[500px]">
      <TableHeader columns={generateColumn}>{(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}</TableHeader>
      <TableBody emptyContent={'No Data Display'} items={items}>
        {(item: any) => (
          <TableRow key={item.key} className="odd:bg-poslight even:bg-slate-200 ">
            {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
