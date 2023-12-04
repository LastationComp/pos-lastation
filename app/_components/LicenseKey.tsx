'use client';
import Image from 'next/image';
import { FormEvent, useEffect, useState } from 'react';
import { signIn, useSession, signOut } from 'next-auth/react';
import useSWR from 'swr';

export default function LicenseKey(props: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const handleLicenseKey = async () => {
    props.setHasLicense(true);
    const key = localStorage.getItem('license_key') ?? licenseKey;
    const res = await fetch('/api/license', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        license_key: key,
      }),
    });
    setIsLoading(false);
    const result = await res.json();
    if (!res.ok && res.status !== 200) {
      return setErrMsg(result?.message ?? 'Internal Server Error');
    }

    localStorage.setItem('license_key', result?.license_key);
    localStorage.setItem('client_code', result?.client_code);
    props.setHasLicense(true);
    return;
  };

  useEffect(() => {
    handleLicenseKey();
  }, []);
  return (
    <>
      {/* {handleLicenseKey()} */}
      <div className="absolute top-0 left-0 w-screen h-screen z-999 bg-gray-900/40 rounded p-3 backdrop-blur-sm ">
        <div className="flex flex-col justify-center items-center h-full gap-5">
          <span className="font-bold text-white">I think you has a first time use this web app. to Confirm your identity, please insert your license key</span>
          <form
            action=""
            method="post"
            onSubmit={(e) => {
              e.preventDefault();
              setErrMsg('');
              setIsLoading(true);
              setTimeout(() => {
                return handleLicenseKey();
              }, 500);
            }}
          >
            {errMsg && <span className="bg-red-600 text-white rounded">{errMsg}</span>}
            <div className="flex">
              <input
                type="text"
                required
                name="license_key"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                className="bg-white w-[500px] shadow-md rounded-l px-3 p-3 outline  outline-blue-600 focus:outline-gray-600 transition outline-1"
                placeholder="Input your License Key"
                autoFocus
              />
              <button className="justify-center bg-green-600 rounded-r p-3 hover:bg-green-700 transition disabled:bg-green-700 text-white" disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
