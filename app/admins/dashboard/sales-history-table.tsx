'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import useSWR from 'swr';
import { formatRupiah } from '@/app/_lib/RupiahFormat';
import { Button, Tooltip } from '@nextui-org/react';
import { fetcher } from '@/app/_lib/Fetcher';
import { formatDate } from '@/app/_lib/DateFormat';
import PosTableNew from '@/app/_lib/NextUiPos/PosTable';

export default function SalesHistoryTable({ session }: { session: any }) {
  const { data } = useSWR('/api/employee/saleshistory?license=' + session?.user?.license_key, fetcher);

  const getSalesHistory = () => {
    let newData: any[] = [];

    data?.sales_history.forEach((trx: any, i: number) => {
      newData.push({
        key: i + 1,
        no_references: trx.no_ref,
        date: formatDate(trx.created_at),
        employee: trx.employee.name,
        total: formatRupiah(trx.total_price),
        action: (
          <Tooltip content={'Detail'} showArrow={true} placement={'left'} color={'default'}>
            <Button isIconOnly className="bg-posblue" size="sm">
              <FontAwesomeIcon icon={faEye} />
            </Button>
          </Tooltip>
        ),
      });
    });

    return newData;
  };
  return <PosTableNew data={getSalesHistory()} columns={['NO References', 'Date', 'Employee', 'Total', 'Action']} />;
}
