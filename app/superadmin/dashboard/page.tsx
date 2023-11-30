'use client';
import React from 'react';
import { signOut } from 'next-auth/react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
export const fetcher = (url: string) => fetch(url).then((res) => res.json());
export default function Dashboard() {
  const router = useRouter();
  const { data } = useSWR('/api/clients', fetcher);
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
                  <th scope="col" className="px-6 py-3">
                    NO
                  </th>
                  <th scope="col" className="px-6 py-3">
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
                    Client Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.map((data: any, i: number) => (
                    <tr key={data.license_key} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 text-center">
                      <td>{i + 1}</td>
                      <td className="px-6 py-4">{data.license_key}</td>
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {data.client_name}
                      </th>
                      <td className="px-6 py-4">{data.client_code}</td>
                      <td className="px-6 py-4">{data.admin.username}</td>
                      <td className="">{data.is_active ? 'Active' : 'Non Active'}</td>
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
