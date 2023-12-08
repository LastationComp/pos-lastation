'use client';
import React from 'react';
import { signOut } from 'next-auth/react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import PosTable from '@/app/_components/PosTable';
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
      <section className="container mx-auto mt-5">
        <button className="bg-blue-600 text-white rounded px-3 py-1" onClick={() => router.push('dashboard/clients/add', {})}>
          Add Client
        </button>
        <div className="flex justify-center">
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 text-center">
                <tr>
                  <th scope="col" className="px-6 py-3 w-[20px]">
                    NO
                  </th>
                  <th scope="col" className="px-6 py-3 w-[500px]">
                    License Key
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Client Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Client Code
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Username
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Time Expires
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Client Status
                  </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.map((data: any, i: number) => (
                    <tr key={data.license_key} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 text-center">
                      <td className='text-center'>{i + 1}</td>
                      <td className="px-6 py-4">
                        <span>{data.license_key}</span>
                        <button onClick={() => handleCopy(data.license_key)} id={data.license_key} className="rounded bg-gray-600  mx-1 p-1">
                          Copy
                        </button>
                      </td>
                      <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {data.client_name}
                      </td>
                      <td className="px-6 py-4">{data.client_code}</td>
                      <td className="px-6 py-4">{data.admin.username}</td>
                      <td>{data.expires_left}</td>
                      <td className="">{data.is_active ? 'Active' : 'Non Active'}</td>
                      <td className="px-6 py-4">
                        <button onClick={() => handleDelete(data.client_code)} className="font-medium text-red-600 dark:text-red-500 hover:underline">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
