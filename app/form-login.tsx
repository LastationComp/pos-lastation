'use client';

import Image from 'next/image';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Chip } from '@nextui-org/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';

export default function FormLogin() {
  const [role, setRole] = useState('employee');
  const [wrong, setWrong] = useState('');
  const [isLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [resetLicense, setResetLicense] = useState(false);
  const router = useRouter();
  const handleSelectRole = (string: string) => {
    if (role === string) return;
    return setRole(string);
  };
  const handleSubmit = async (data: FormData) => {
    if (role === 'employee') {
      const promise = await fetch('/api/license/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          license_key: localStorage.getItem('license_key') ?? '',
        }),
      });
      const result = await promise.json();

      if (!promise.ok && promise?.status !== 200) {
        setIsLoading(false);
        return setWrong(result?.message);
      }
    }
    const res = await signIn('credentials', {
      username: data.get('username'),
      password: data.get('password'),
      license_key: localStorage.getItem('license_key') ?? '',
      role: role,
      redirect: false,
      callbackUrl: process.env.NEXT_URL,
    });
    if (res?.ok && res.status === 200) {
      if (role === 'admin') return router.push('/admins/dashboard');
      if (role === 'employee') return router.push('/employees/dashboard');
    }
    setWrong('Username or Password is Wrong');
    setIsLoading(false);
  };
  return (
    <form
      action=""
      onSubmit={(e) => {
        e.preventDefault();
        setIsLoading(true);
        const formdata = new FormData(e.currentTarget);
        setTimeout(() => {
          return handleSubmit(formdata);
        }, 500);
      }}
    >
      <div className="flex flex-col w-auto p-10 items-center rounded-[10px] shadow-md sm:w-[500px]  p-3 bg-posgray gap-3">
        <Image src="/images/logo.png" alt="Logo Last Station" width={45} height={61} />
        <h1 className="text-center text-2xl font-bold font-['Montserrat']">Login</h1>
        {wrong && (
          <div className=" w-full relative flex items-center px-4 py-2 text-sm font-bold text-white bg-red-500 rounded" role="alert">
            <p>{wrong}</p>
          </div>
        )}
        <div className="flex flex-col w-full gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="text-medium font-semibold font-['montserrat']">
              Username
            </label>
            <input id="username" name="username" type="text" className="py-2 rounded-[5px] bg-poslight px-3 outline outline-1 outline-posblue text-black" placeholder="Input your Username" required />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-medium font-semibold font-['montserrat']">
              Password
            </label>
            <input id="password" name="password" type="password" className="py-2 rounded-[5px] bg-poslight  px-3 outline outline-1 outline-posblue text-black" placeholder="Input your Password" required />
          </div>
        </div>
        <div className="flex gap-x-8 ">
          <div className="flex gap-2 items-center cursor-pointer" onClick={(e) => handleSelectRole('employee')}>
            <input type="checkbox" name="employee" className="focus:ring-0" id="chk-emp" checked={role === 'employee'} readOnly />
            <label htmlFor="chk-emp">As Employee</label>
          </div>
          <div className="flex gap-2 items-center  cursor-pointer" onClick={(e) => handleSelectRole('admin')}>
            <input type="checkbox" name="admin" className="focus:ring-0" id="chk-adm" checked={role === 'admin'} readOnly />
            <label htmlFor="chk-adm">As Admin</label>
          </div>
        </div>
        <button className="justify-center rounded-xl w-full p-3 text-base font-semibold font-['montserrat'] bg-posblue hover:bg-teal-500 transition hover:text-posgray" disabled={isLoading && isLogin}>
          {isLoading && isLogin ? 'Signing...' : 'Sign In'}
        </button>
        <div className="text-end">
          <Chip
            variant="flat"
            className="hover:cursor-pointer"
            onClick={() => {
              localStorage.removeItem('license_key');
              setResetLicense(true);
              window.location.reload();
            }}
            startContent={<FontAwesomeIcon icon={!resetLicense ? faClockRotateLeft : faCheck} />}
            color={!resetLicense ? 'warning' : 'success'}
          >
            Reset License Key
          </Chip>
        </div>
      </div>
    </form>
  );
}
