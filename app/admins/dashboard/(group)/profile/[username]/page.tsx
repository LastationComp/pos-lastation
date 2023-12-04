'use client';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';

export const fetcher = (url: string) => fetch(url).then((res) => res.json());
export default function ProfilePage({ params }: { params: { username: string } }) {
  const session: any = useSession();
  const [adminName, setAdmin] = useState('');
  const [success, setSuccess] = useState(false)
  const { data } = useSWR(`/api/admins/${params.username}?license=${session.data?.user?.license_key}`, fetcher);

  const handleSubmit = async(target: HTMLFormElement) => {
    const formData = new FormData(target)


  }
  useEffect(() => {
    // setClientName(data?.client ?? '')
  }, [data]);
  return (
    <>
      <div>Ini Profile {params.username}</div>
      {!data && (
        <div className="flex flex-col justify-center w-1/2 mt-5">
          <div className="flex flex-col animate-pulse">
            <label htmlFor="client-name-loading" className="px-5 py-3 w-[100px] rounded bg-slate-300 my-3"></label>
            <input type="text" id="client-name-loading" className="px-5 rounded bg-slate-300" disabled />
          </div>
          <div className="flex flex-col animate-pulse">
            <label htmlFor="client-username-loading" className="px-5 py-3 w-[100px] rounded bg-slate-300 my-3"></label>
            <input type="text" id="client-username-loading" className="px-5 rounded bg-slate-300" disabled />
          </div>
          <div className="flex flex-col animate-pulse">
            <label htmlFor="client-loading" className="px-5 py-3 w-[100px] rounded bg-slate-300 my-3"></label>
            <input type="text" id="client-loading" className="px-5 rounded bg-slate-300" disabled />
          </div>
          <div className="flex flex-row w-full gap-3">
            <div className="flex flex-col basis-1/2 animate-pulse">
              <label htmlFor="admin-new-password-loading" className="px-5 py-3 w-[100px] rounded bg-slate-300 my-3"></label>
              <input type="password" id="admin-new-password-loading" className="px-5 rounded bg-slate-300" />
              <span className=" text-sm bg-slate-300 w-full py-2 my-1 rounded"></span>
            </div>
            <div className="flex flex-col basis-1/2 animate-pulse">
              <label htmlFor="admin-old-password-loading" className="px-5 py-3 w-[100px] rounded bg-slate-300 my-3"></label>
              <input type="password" id="admin-old-password-loading" className="px-5 rounded bg-slate-300" />
            </div>
          </div>
          <div className="animate-pulse">
            <button className="text-slate-300 rounded bg-slate-300 px-3 py-1 font-semibold">Save</button>
          </div>
        </div>
      )}
      {data && (
        <div className="flex flex-col justify-center w-1/2 gap-5 mt-5">
          <div className="flex flex-col">
            <label htmlFor="client-name">Client Name</label>
            <input type="text" id="client-name" className="rounded shadow-md px-3 py-1" value={data?.client} placeholder={'Your Client Name'} disabled />
          </div>
          <div className="flex flex-col">
            <label htmlFor="admin-name">Name</label>
            <input type="text" id="admin-name" className="rounded shadow-md px-3 py-1" value={data?.admin?.name} placeholder={'Your Admin Name'} disabled />
          </div>
          <div className="flex flex-col">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" autoComplete={data?.admin?.username} className="rounded shadow-md px-3 py-1" value={data?.admin?.username} placeholder={'Your Username'} disabled />
          </div>
          <form action="" method="post" onSubmit={(e) => {
            e.preventDefault()
            setSuccess(false)
            setTimeout(() => {
              return handleSubmit(e.currentTarget)
            }, 500)
          }}>
            <div className="flex flex-row w-full gap-3">
              <div className="flex flex-col basis-1/2">
                <label htmlFor="admin-new-password">Set New Password</label>
                <input type="password" id="admin-new-password" name='new-password' className="rounded shadow-md px-3 py-1" placeholder={'Insert to change'} required />
                <span className="text-slate-400 text-sm">Please fill if you want to change password</span>
              </div>
              <div className="flex flex-col basis-1/2">
                <label htmlFor="admin-old-password">Old Password</label>
                <input type="password" id="admin-old-password" name='old-password' className="rounded shadow-md px-3 py-1" placeholder={'Insert to change'} required />
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <button className="text-white rounded bg-green-600 px-3 py-1 hover:bg-green-700 font-semibold" type='submit'>Save</button>
              {success && <span className='text-green-600'>Saved Successfully</span>}
            </div>
          </form>
        </div>
      )}
    </>
  );
}
