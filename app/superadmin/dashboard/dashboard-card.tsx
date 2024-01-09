'use client';
import { fetcher } from '@/app/_lib/Fetcher';
import { faUserPen, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Skeleton } from '@nextui-org/react';
import { useSession } from 'next-auth/react';
import React from 'react';
import useSWR from 'swr';

export default function DashboardCard() {
  const session: any = useSession();
  const id = session?.data?.user?.id;
  const { data } = useSWR(`/api/superadmin/dashboard/${id}`, fetcher);
  return (
    <>
      <Skeleton isLoaded={data?.TotalClient} className="rounded-md">
        <div className="wrapper shadow-lg outline outline-0 rounded-md px-2 py-3 bg-purple-500">
          <div className="px-3">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-white text-md">Clients</h1>
                <h1 className="text-white text-xl">{data?.TotalClient}</h1>
              </div>
              <div>
                <FontAwesomeIcon className="text-white" icon={faUserTie} size={'2xl'} />
              </div>
            </div>
          </div>
        </div>
      </Skeleton>
      <Skeleton isLoaded={data?.TotalClient} className="rounded-md">
        <div className="wrapper shadow-lg outline outline-0 rounded-md px-2 py-3 bg-blue-500">
          <div className="px-3">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-white text-md">Employee</h1>
                <h1 className="text-white text-xl">{data?.TotalEmployee}</h1>
              </div>
              <div>
                <FontAwesomeIcon className="text-white" icon={faUserPen} size={'2xl'} />
              </div>
            </div>
          </div>
        </div>
      </Skeleton>
    </>
  );
}
