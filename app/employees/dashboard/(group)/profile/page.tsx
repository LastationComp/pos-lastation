'use client';
import LoadingComponent from '@/app/_components/LoadingComponent';
import { signOut, useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { BaseSyntheticEvent, ChangeEvent, useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import useSWR from 'swr';

export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function EmployeeProfilePage() {
  const {data: session, update}: any = useSession();
  const { data, mutate } = useSWR('/api/employee/profile/' + session?.user?.id, fetcher);
  const router = useRouter()
  const [image, setImage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const profileRef: any = useRef(null);
  const handleChangeProfile = (e: any) => {
    setImage(e.target.files[0]);
  };

  const generateImage = (url: string) => {
    if (image) return URL.createObjectURL(image ?? new Blob());
    const realPath = `/employees/${url}`;
    return realPath;
  };

  const clearCondition = () => {
    setErrMsg('');
    setSuccess(false);
  };

  const handleSubmit = async (e: BaseSyntheticEvent) => {
    const formData = new FormData(e.target);
    const res = await fetch(`/api/employee/profile/${session?.user?.id}`, {
      method: 'POST',
      body: formData
    });
    setSuccess(res.ok && res.status === 200);
    setIsLoading(false);
    const result = await res.json();
    if (!res.ok && res.status !== 200) {
      return setErrMsg(result?.message);
    }
    update({
      user: {
        avatar_url: result?.avatar_url,
        name: formData.get('name') as string
      }
    })
    e.target.reset()
    if (result?.isWithPassword) return signOut()
  };

  const showWarning = (e: BaseSyntheticEvent) => {
    Swal.fire({
        title: 'Are you sure to save?',
        html: '<span class="text-black/30">If you change Password, it will be automatically <span class="text-red-500">logout</span></span>',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        width: 600,
        showConfirmButton: true
    }).then((res) => {
        if (res.isConfirmed) {
            setTimeout(() => {
              return handleSubmit(e);
            }, 500);
        }
        if (res.isDismissed) {
            clearCondition()
            setIsLoading(false)
        }
    })
  }
  useEffect(() => {
    setName(data?.data?.name ?? '');
    console.log(data?.data?.name);
  }, [data]);

  if (!data) return <LoadingComponent />
  return (
    <>
      <div className="flex justify-center">
        <form
          action=""
          method="post"
          encType="multipart/form-data"
          onSubmit={(e) => {
            e.preventDefault();
            clearCondition();
            setIsLoading(true);
            return showWarning(e);
          }}
        >
          <div className="flex flex-col relative gap-3 w-[700px] my-3">
            {errMsg && <div className="bg-red-500 text-white p-3 rounded">{errMsg}</div>}
            {success && <div className="bg-green-600 text-white p-3 rounded">Saved Successfully</div>}
            <div className="flex flex-col gap-5 items-center">
              <Image
                src={generateImage(data?.data?.avatar_url ?? 'default.png')}
                onClick={() => {
                  profileRef.current.click();
                }}
                loading="lazy"
                className="rounded-full border border-1 cursor-pointer border-posgray object-cover max-w-[200px] h-[200px] "
                width={200}
                height={200}
                alt={data?.data?.name ?? 'Employee'}
              />
              <input type="file" name="avatar" id="avatar" accept="image/*" hidden ref={profileRef} onChange={handleChangeProfile} />
              <span className="text-sm text-black/30">Click your profile to change image</span>
            </div>
            <div className="flex flex-col ">
              <label htmlFor="emp_code">Employee Code</label>
              <input type="text" id="emp_code" required value={data?.data?.employee_code} disabled className="rounded px-3 py-1 shadow-md disabled:bg-slate-200 outline outline-1 outline-posblue" placeholder="Input your name" />
            </div>
            <div className="flex flex-col ">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" required value={name} onChange={(e) => setName(e.target.value)} className="rounded px-3 py-1 shadow-md outline outline-1 outline-posblue" placeholder="Input your name" />
            </div>
            <div className="flex flex-col ">
              <label htmlFor="new-password">Set New Password</label>
              <input type="password" id="new-password" name="new-password" className="rounded px-3 py-1 shadow-md outline outline-1 outline-posblue" placeholder="Input to change password" />
            </div>
            <div className="flex flex-col ">
              <label htmlFor="re-password">Re-Password</label>
              <input type="password" id="re-password" name="re-password" className="rounded px-3 py-1 shadow-md outline outline-1 outline-posblue" placeholder="Input to change password" />
            </div>
            <div className="flex flex-col ">
              <label htmlFor="old-password">Old Password</label>
              <input type="password" id="old-password" name="old-password" className="rounded px-3 py-1 shadow-md outline outline-1 outline-posblue" placeholder="Input to change password" />
            </div>
            <button disabled={isLoading} className={'rounded bg-posblue hover:bg-teal-500 hover:text-white p-2 my-3 transition ' + (isLoading ? 'bg-teal-500 text-white' : '')} type="submit">
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
