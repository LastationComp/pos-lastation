'use client';
import LoadingComponent from '@/app/_components/LoadingComponent';
import { fetcher } from '@/app/_lib/Fetcher';
import { useSession } from 'next-auth/react';
import React, { BaseSyntheticEvent, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import useSWR from 'swr';

export default function AdminSettingPage() {
  const session: any = useSession();
  const [canLogin, setCanLogin] = useState(false);
  const [canCreate, setCanCreate] = useState(false);
  const [canUpdate, setCanUpdate] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openHours, setOpenHours] = useState("00:00:00")
  const [closeHours, setCloseHours] = useState("00:00:00")
  const [success, setSuccess] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const { data, mutate } = useSWR(`/api/admins/${session.data?.user.username}/settings?license=${session.data?.user.license_key}`, fetcher, {
    revalidateOnFocus: false,
  });

  const handleSubmit = async () => {
    const res = await fetch(`/api/admins/${session?.data?.user.username}/settings?license=${session?.data?.user?.license_key}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        canCreate: canCreate,
        canLogin: canLogin,
        canUpdate: canUpdate,
        canDelete: canDelete,
        openHours: openHours,
        closeHours: closeHours
      }),
    });
    const result = await res.json();
    if (!res.ok && res.status !== 200) {
      setErrMsg(result?.message);
    }
    setIsLoading(false);
    mutate(data)
    setSettings();
    return setSuccess(res.ok && res.status === 200);
  };

  const ShowConfirm = (e: BaseSyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    Swal.fire({
      title: 'Are you sure to change this Settings?',
      icon: 'warning',
      width: 700,
      html: 'After you change it, your all Employee will be configured with this Settings',
      showConfirmButton: true,
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setSuccess(false);
        setIsLoading(true);
        setErrMsg('');
        return setTimeout(() => {
          return handleSubmit();
        }, 500);
      }
      if (result.isDismissed) {
        setSuccess(false);
        setIsLoading(false);
        setSettings()
        setErrMsg('');
      }
    });
  };

  const setSettings = () => {
    setCanLogin(data?.settings?.emp_can_login ?? false);
    setCanCreate(data?.settings?.emp_can_create ?? false);
    setCanUpdate(data?.settings?.emp_can_update ?? false);
    setCanDelete(data?.settings?.emp_can_delete ?? false);
    setOpenHours(data?.settings?.openHours ?? "00:00:00")
    setCloseHours(data?.settings?.closeHours ?? '00:00:00');
  };

  useEffect(() => {
    setSettings();
  }, [data]);
  
  if(!data) return (
    <LoadingComponent></LoadingComponent>
  )
  return (
    <>
      <div className="text-xl font-semibold">Settings</div>
      <form action="" method="post" onSubmit={(e) => ShowConfirm(e)}>
        <div className="grid grid-cols-2 gap-5">
          {errMsg && <div className="col-span-2 rounded bg-red-600 p-3 text-white">{errMsg}</div>}
          <div className="col-span-2 flex flex-col">
            <div className="flex items-center gap-3">
              <input type="checkbox" name="chk_emp_can_login" className="rounded p-3 w-5 h-5" onChange={(e) => setCanLogin(e.target.checked)} checked={canLogin} id="chk_emp_can_login" />
              <label htmlFor="chk_emp_can_login">Employee Can Login</label>
            </div>
            <div>
              <p className="text-sm text-black/40 w-[40%]">This option make your all Employee can login in this Web App</p>
            </div>
          </div>
          <div className="col-span-2 flex flex-col">
            <div className="flex items-center gap-3">
              <input type="checkbox" name="chk_emp_can_create" className="rounded p-3 w-5 h-5" onChange={(e) => setCanCreate(e.target.checked)} id="chk_emp_can_create" checked={canCreate} />
              <label htmlFor="chk_emp_can_create">Employee Can Create Product</label>
            </div>
            <div>
              <p className="text-sm text-black/40 w-[40%]">This option make your all Employee can Create the product in Your Bussiness</p>
            </div>
          </div>
          <div className="col-span-2 flex flex-col">
            <div className="flex items-center gap-3">
              <input type="checkbox" name="chk_emp_can_update" className="rounded p-3 w-5 h-5" onChange={(e) => setCanUpdate(e.target.checked)} id="chk_emp_can_update" checked={canUpdate} />
              <label htmlFor="chk_emp_can_update">Employee Can Update Product</label>
            </div>
            <div>
              <p className="text-sm text-black/40 w-[40%]">This option make your all Employee can Update the product in Your Bussiness</p>
            </div>
          </div>
          <div className="col-span-2 flex flex-col">
            <div className="flex items-center gap-3">
              <input type="checkbox" name="chk_emp_can_delete" className="rounded accent-red-600 p-3 w-5 h-5" onChange={(e) => setCanDelete(e.target.checked)} id="chk_emp_can_delete" checked={canDelete} />
              <label htmlFor="chk_emp_can_delete">
                Employee Can <span className="text-red-600">Delete Product</span>
              </label>
            </div>
            <div>
              <p className="text-sm text-black/40 w-[40%]">
                This option make your all Employee can Delete the product in Your Bussiness.{' '}
                <span className="text-red-600">
                  Please configure this option to avoid of <span className="font-semibold">Deleted Products</span>
                </span>
              </p>
            </div>
          </div>
          <div className="col-span-2 flex flex-col w-[40%]">
            <div className="flex items-center gap-5">
              <input type="time"  name="shop-open-time" value={openHours} onChange={(e) => setOpenHours(e.target.value)} className="outline outline-1 outline-gray-600 rounded p-3" id="" />
              <span>Shop Open Time</span>
              <input type="time" name="close-open-time" value={closeHours} onChange={(e) => setCloseHours(e.target.value)} className="outline outline-1 outline-gray-600 rounded p-3" id="" />
              <span>Close Open Time</span>
            </div>
            <span>
              This option make your shop open time configured, <span className="text-red-600">to restrict employee has login outside open time</span>
            </span>
          </div>
          <div>
            <button disabled={isLoading} className="rounded disabled:bg-green-700 bg-green-600 hover:bg-green-700 px-3 py-1 text-white transition" type="submit">
              {isLoading ? 'Saving...' : 'Save'}
            </button>
            {success && <span className="mx-3 text-green-600">Saved Successfully</span>}
          </div>
        </div>
      </form>
    </>
  );
}
