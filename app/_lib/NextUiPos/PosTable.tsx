'use client';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from '@nextui-org/react';
import React from 'react';
import { generateHeaders } from './GenerateHeaderTable';
import { usePathname } from 'next/navigation';

interface PosTable {
  columns: any[];
  data: any[];
}

export default function PosTableNew({ columns = [], data = [] }: PosTable) {
  const generateColumn = generateHeaders(columns);
  const pathname = usePathname();
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const pages = Math.ceil(data.length / rowsPerPage);

  const ExceedPages = pages < page;
  const items = React.useMemo(() => {
    if (data.length === 0) return data;
    if (ExceedPages) {
      setPage(page - 1);
    }
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return data.slice(start, end);
  }, [data, page, rowsPerPage]);

  const handlePagination = (paginated: any) => {
    return setPage(paginated);
  };
  return (
    <>
      <Table removeWrapper aria-labelledby={pathname} bottomContentPlacement={'outside'} isCompact className="sm:overflow-hidden overflow-auto">
        <TableHeader aria-label={pathname} columns={generateColumn}>
          {(column) => (
            <TableColumn aria-label={column.label} className="bg-posgray text-white" key={column.key}>
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={'No Data Display'} items={items} isLoading={!items} loadingContent={'Loading data...'}>
          {(item: any) => (
            <TableRow aria-label={item.key} key={item.key} className="odd:bg-poslight even:bg-slate-200 ">
              {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex justify-between mt-3">
        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered">Rows per Page: {rowsPerPage}</Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem key="10" onClick={() => setRowsPerPage(10)}>
              10
            </DropdownItem>
            <DropdownItem key="25" onClick={() => setRowsPerPage(25)}>
              25
            </DropdownItem>
            <DropdownItem key="50" onClick={() => setRowsPerPage(50)}>
              50
            </DropdownItem>
            <DropdownItem key="100" onClick={() => setRowsPerPage(100)}>
              100
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Pagination aria-label="pagination" isCompact disableAnimation showControls showShadow color="primary" page={page} total={pages} onChange={(page) => handlePagination(page)} />
      </div>
    </>
  );
}
