'use client';
import React, { BaseSyntheticEvent, Suspense, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import PosTable from '@/app/_components/PosTable';
import PosButton from '@/app/_components/PosButton';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faServer } from '@fortawesome/free-solid-svg-icons/faServer';
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
// export const fetcher = (url: string) => fetch(url).then((res) => res.json());

import LoadingComponent from '@/app/_components/LoadingComponent';
import { fetcher } from '@/app/_lib/Fetcher';
import Swal from 'sweetalert2';
export default function Dashboard() {
  const router = useRouter();
  const { data, mutate } = useSWR('/api/superadmin/clients', fetcher, {
    revalidateOnMount: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [clientCode, setClientCode] = useState('');
  const [showOpenUpdateExpires, setOpenUpdateExpires] = useState(false);

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    const clipboard = document.getElementById(value);
    if (clipboard) {
      clipboard.innerHTML = 'Copied';
      setTimeout(() => {
        clipboard.innerHTML = 'Copy';
      }, 3000);
    }
  };

  // if (res.ok && res.status == 200) {
  //   mutate(data);
  // }

  const handleUpdateExpires = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrMsg('');
    const formData = new FormData(e.target);
    const res = await fetch(`/api/superadmin/clients/expires`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_code: clientCode,
        service_days: formData.get('expires_days') ?? 0,
      }),
    });

    const result = await res.json();

    setIsLoading(false);

    if (!res.ok && res.status !== 200) {
      return setErrMsg(result?.message);
    }

    setOpenUpdateExpires(false);
    return mutate(data);
  };

  const handleWarning = async (client_code: string, client_name: string, isDeactivated: boolean) => {
    if (isDeactivated)
      return Swal.fire({
        title: 'Deactivate this Client?',
        text: `${client_name}`,
        icon: 'warning',
        showCancelButton: true,
        showConfirmButton: true,
      }).then((res) => {
        if (res.isConfirmed) return handleDeactivate(client_code);
      });

    return Swal.fire({
      title: 'Activate this Client',
      text: `${client_name}`,
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton: true,
    }).then((res) => {
      if (res.isConfirmed) return handleActivate(client_code);
    });
  };

  const handleDeactivate = async (client_code: string) => {
    const res = await fetch(`/api/superadmin/clients/${client_code}`, {
      method: 'DELETE',
    });

    if (res) return mutate(data);
  };

  const handleActivate = async (client_code: string) => {
    const res = await fetch(`/api/superadmin/clients/${client_code}`, {
      method: 'PUT',
    });

    if (res) return mutate(data);
  };

  if (!data) return <LoadingComponent />
  return (
    <>
      <div
        className={'absolute inset-0 flex justify-center bg-white/30 backdrop-blur-sm items-center ' + (showOpenUpdateExpires ? 'block' : 'hidden')}
        onClick={(e) => {
          const popExpires = document.getElementById('popup-expires') as HTMLDivElement;

          if (!popExpires.contains(e.target as HTMLElement)) return setOpenUpdateExpires(false);
        }}
      >
        <form action="" method="post" onSubmit={handleUpdateExpires}>
          <div id="popup-expires" className="bg-white rounded p-3 flex flex-col">
            {errMsg && <div className="bg-red-500 p-3 rounded text-white">{errMsg}</div>}
            <label htmlFor="expires_days">Service Days</label>
            <input type="text" id="expires_days" name="expires_days" placeholder="Service Days..." className="rounded outline outline-1 outline-posblue shadow-md px-3 py-1" />
            <button type="submit" disabled={isLoading} className="bg-posblue rounded px-3 py-2 my-1 hover:text-white hover:bg-teal-500 transition flex justify-center items-center gap-3">
              <FontAwesomeIcon icon={isLoading ? faSpinner : faServer} spin={isLoading} />
              {isLoading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
      <div className="text-xl font-semibold">Clients</div>
      <div className="flex justify-end items-center">
        <PosButton icon={faPlus} onClick={() => router.push('clients/add')}>
          Add Client
        </PosButton>
      </div>
      <PosTable fixed headers={['No', 'License Key', 'Client Name', 'Client Code', 'Username', 'Time Expires', 'Client Status', 'Action']}>
        {data &&
          data.map((data: any, i: number) => (
            <tr key={data.license_key}>
              <td className="p-3">{i + 1}</td>
              <td className="p-3">
                {data.license_key}
                <button onClick={() => handleCopy(data.license_key)} id={data.license_key} className="rounded bg-gray-600  mx-1 p-1 text-white">
                  Copy
                </button>
              </td>
              <td className="p-3">{data.client_name}</td>
              <td className="p-3">{data.client_code}</td>
              <td className="p-3">{data.admin.username}</td>
              <td className="p-3">{data.expires_left}</td>
              <td className="p-3">{data.is_active ? 'Active' : 'Non Active'}</td>
              <td className="gap-3 ">
                {data.is_active ? (
                  <button onClick={() => handleWarning(data.client_code, data.client_name, true)} className="font-medium text-red-600 dark:text-red-500 hover:underline">
                    Deactivate
                  </button>
                ) : (
                  <button onClick={() => handleWarning(data.client_code, data.client_name, false)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                    Activate
                  </button>
                )}
                <button
                  className="font-medium text-blue-600 underline items-center my-auto px-3"
                  onClick={() => {
                    setClientCode(data.client_code);
                    setOpenUpdateExpires(true);
                  }}
                >
                  Update Expires
                </button>
              </td>
            </tr>
          ))}
      </PosTable>
    </>
  );
}
