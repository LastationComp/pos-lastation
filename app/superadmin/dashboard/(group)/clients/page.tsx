'use client';
import React from 'react';
import { signOut } from 'next-auth/react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import PosTable from '@/app/_components/PosTable';
import PosButton from '@/app/_components/PosButton';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
export const fetcher = (url: string) => fetch(url).then((res) => res.json());
export default function Dashboard() {
  const router = useRouter();
  const { data, mutate } = useSWR('/api/superadmin/clients', fetcher, {
    revalidateOnMount: true,
  });

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    const clipboard = document.getElementById(value);
    if (clipboard) {
      clipboard.innerHTML = 'Copied';
      setTimeout(() => {
        clipboard.innerHTML = 'Copy'
      }, 1000)
    }
  };
  const handleDelete = async (client_code: string) => {
    const res = await fetch('/api/superadmin/clients/' + client_code, {
      method: 'DELETE',
    });

    if (res.ok && res.status == 200) {
      mutate(data);
    }
  };
  return (
    <>
     <div className="text-xl font-semibold">Clients</div>
      <div className="flex justify-end items-center">
        <PosButton icon={faPlus} onClick={() => router.push('clients/add')}>
          Add Client
        </PosButton>
      </div>
      <PosTable fixed headers={["No", "License Key", "Client Name", "Client Code", "Username", "Time Expires", "Client Status", "Action"]}>
        {data && data.map((data: any, i: number) => (
        <tr key={data.license_key}>
          <td className="p-3">{i+1}</td>
          <td className='p-3'>{data.license_key}
          <button onClick={() => handleCopy(data.license_key)} id={data.license_key} className="rounded bg-gray-600  mx-1 p-1 text-white">
                Copy
          </button>
          </td>
          <td className="p-3">{data.client_name}</td>
          <td className="p-3">{data.client_code}</td>
          <td className="p-3">{data.admin.username}</td>
          <td className="p-3">{data.expires_left}</td>
          <td className="p-3">{data.is_active ? 'Active' : 'Non Active'}</td>
          <td>
          <button onClick={() => handleDelete(data.client_code)} className="font-medium text-red-600 dark:text-red-500 hover:underline">
            Delete
         </button>
          </td>
        </tr>
        ))}
      </PosTable>
    </>
  );
}
