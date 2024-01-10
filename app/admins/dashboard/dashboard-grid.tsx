'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faUsersSlash, faUsers } from '@fortawesome/free-solid-svg-icons';
import useSWR from 'swr';
import { formatRupiah } from '@/app/_lib/RupiahFormat';
import { Card, CardBody, CardFooter, CardHeader, Divider, Skeleton } from '@nextui-org/react';
import { fetcher } from '@/app/_lib/Fetcher';

export default function DashboardGrid({ session }: { session: any }) {
  const { data } = useSWR(`/api/admins/dashboard/${session?.user?.id}`, fetcher);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <Card className="col-span-1 h-full" shadow={'sm'}>
        <CardHeader className="flex justify-between">
          <h1>Active Employee</h1>
          <FontAwesomeIcon icon={faUsers} className="bg-teal-300 rounded-full p-2" />
        </CardHeader>
        <Divider />
        <Skeleton className="h-full" isLoaded={data}>
          <CardBody>
            <span className="text-2xl font-bold  ">{data?.total_emp_active}</span>
          </CardBody>
        </Skeleton>
      </Card>
      <Card className="col-span-1" shadow={'sm'}>
        <CardHeader className="flex justify-between">
          <h1>Non-Active Employee</h1>
          <FontAwesomeIcon icon={faUsersSlash} className="bg-red-400 rounded-full p-2" />
        </CardHeader>
        <Divider />
        <Skeleton className="h-full" isLoaded={data}>
          <CardFooter>
            <span className="text-2xl font-bold  ">{data?.total_emp_nonactive}</span>
          </CardFooter>
        </Skeleton>
      </Card>
      <Card className="col-span-1" shadow={'sm'}>
        <CardHeader className="flex justify-between">
          <h1 className="">Transactions Today</h1>
          <FontAwesomeIcon icon={faDollarSign} className="rounded-full bg-orange-300 px-3 py-2" />
        </CardHeader>
        <Divider />
        <Skeleton className="h-full" isLoaded={data}>
          <CardFooter>
            <div className="flex flex-col w-full">
              <div className="flex justify-between w-full">
                <span className="font-bold">
                  <h1 className="py-1">Total Income</h1>
                </span>
                <span className="font-bold">{formatRupiah(data?.total_transactions_today.total_price)}</span>
              </div>
              <div className="flex justify-between w-full">
                <span className="text-sm">Total Transactions</span>
                <span className="text-sm">{data?.total_transactions_today.total_trx}</span>
              </div>
            </div>
          </CardFooter>
        </Skeleton>
      </Card>
      <Card className="col-span-1" shadow={'sm'}>
        <CardHeader className="flex justify-between">
          <h1 className="">Transactions Monthly</h1>
          <FontAwesomeIcon icon={faDollarSign} className="rounded-full bg-orange-300 px-3 py-2" />
        </CardHeader>
        <Divider />
        <Skeleton className="h-full" isLoaded={data}>
          <CardFooter>
            <div className="flex flex-col w-full">
              <div className="flex justify-between w-full">
                <span className="font-bold">
                  <h1 className="py-1">Total Income</h1>
                </span>
                <span className="font-bold">{formatRupiah(data?.total_transactions_monthly.total_price)}</span>
              </div>
              <div className="flex justify-between w-full">
                <span className="text-sm">Total Transactions</span>
                <span className="text-sm">{data?.total_transactions_monthly.total_trx}</span>
              </div>
            </div>
          </CardFooter>
        </Skeleton>
      </Card>
    </div>
  );
}
