'use client';

import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function FormLoginSuperadmin() {
  const [wrong, setWrong] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (data: FormData) => {
    const res = await signIn('credentials', {
      username: data.get('username'),
      password: data.get('password'),
      role: 'super_admin',
      license_key: null,
      redirect: false,
    });
    setWrong(!res?.ok ?? false);
    if (res?.ok && res.status == 200) return router.push('/superadmin/dashboard');
    setIsLoading(false);
    if (res?.ok) return router.push('dashboard');
  };
  return (
    <form
      action=""
      onSubmit={(e) => {
        setIsLoading(true);
        setWrong(false);
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        setTimeout(() => {
          return handleSubmit(formData);
        }, 500);
      }}
    >
      <div className="flex flex-col justify-center items-center w-[500px] h-[450px] p-3 bg-posgray my-auto rounded-[10px] gap-3">
        <Image src="/images/logo.png" alt="Logo Last Station" width={45} height={61} />
        <h1 className="text-center text-2xl font-bold font-['Montserrat']">Login Super Admin</h1>
        {wrong && (
          <div className=" w-[420px] h-[35px] relative flex items-center px-4 py-2 text-sm font-bold text-white bg-red-500 rounded" role="alert">
            <p>Username or Password is Wrong</p>
          </div>
        )}
        <div className="flex flex-col w-[400px] h-[160px] gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="text-medium font-semibold font-['montserrat']">
              Username
            </label>
            <input id="username" name="username" type="text" className="h-[35px] rounded-[5px] px-3 outline outline-0 shadow-md text-black " placeholder="Input your Username" required autoFocus />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-medium font-semibold font-['montserrat']">
              Password
            </label>
            <input id="password" name="password" type="password" className="h-[35px] rounded-[5px] px-3 outline outline-0 text-black " placeholder="Input your Password" required />
          </div>
        </div>
        <div className="pt-4">
          <button className="justify-center rounded-xl w-[400px] p-3 text-base font-semibold font-['montserrat'] bg-posblue hover:bg-teal-500 transition hover:text-posgray" disabled={isLoading}>
            {isLoading ? 'Signing...' : 'Sign In'}
          </button>
        </div>
      </div>
    </form>
  );
}
