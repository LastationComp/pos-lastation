'use client';

import { signOut, useSession } from 'next-auth/react';
import React, { BaseSyntheticEvent, useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import useSWR from 'swr';
import defaultProfile from '@/public/employees/default.png';
import { fetcher } from '@/app/_lib/Fetcher';
import { Image } from '@nextui-org/react';
import LoadingComponent from '@/app/_components/LoadingComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import FallbackMessage from '@/app/_components/FallbackMessage';

export default function FormProfile({ session }: { session: any }) {
  const { update } = useSession();
  const { data } = useSWR('/api/employee/profile/' + session?.user?.id, fetcher);
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
    if (!url) return null;
    return url;
  };

  const clearCondition = () => {
    setErrMsg('');
    setSuccess(false);
  };

  const handleSubmit = async (e: BaseSyntheticEvent) => {
    const formData = new FormData(e.target);
    const res = await fetch(`/api/employee/profile/${session?.user?.id}`, {
      method: 'POST',
      body: formData,
    });
    setSuccess(res.ok && res.status === 200);
    setIsLoading(false);
    const result = await res.json();
    if (!res.ok && res.status !== 200) {
      return setErrMsg(result?.message);
    }
    await update({
      user: {
        avatar_url: result?.avatar_url,
        name: name,
      },
    });
    e.target.reset();
    if (result?.isWithPassword) {
      await signOut({ redirect: true });
    }
  };

  const showWarning = (e: BaseSyntheticEvent) => {
    Swal.fire({
      title: 'Are you sure to save?',
      html: '<span class="text-black/30">If you change Password, it will be automatically <span class="text-red-500">logout</span></span>',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      width: 600,
      showConfirmButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        setTimeout(() => {
          return handleSubmit(e);
        }, 500);
      }
      if (res.isDismissed) {
        clearCondition();
        setIsLoading(false);
      }
    });
  };
  useEffect(() => {
    setName(data?.data?.name ?? '');
  }, [data]);

  if (!data) return <LoadingComponent />;
  return (
    <>
      <form
        action=""
        method="post"
        encType="multipart/form-data"
        className="w-screen"
        onSubmit={(e) => {
          e.preventDefault();
          clearCondition();
          setIsLoading(true);
          return showWarning(e);
        }}
      >
        <div className="flex flex-col relative gap-3 my-3">
          {errMsg && <FallbackMessage message={errMsg} state={'danger'} />}
          {success && <FallbackMessage message="Saved Successfully" state={'success'} />}
          <div className="flex flex-col gap-5 items-center">
            <Image
              src={generateImage(data?.data?.avatar_url) ?? defaultProfile.src}
              onClick={() => {
                profileRef.current.click();
              }}
              isBlurred
              isZoomed
              loading="lazy"
              radius="full"
              className="border border-1 cursor-pointer border-posgray object-cover max-w-[200px] h-[200px] "
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
    </>
  );
}
