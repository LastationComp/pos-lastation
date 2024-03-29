'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import { useRouter } from 'next/navigation';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons/faCaretLeft';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons/faTriangleExclamation';

export default function FormAdd({ session }: { session: any }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [name, setName] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const handleSubmit = async () => {
    const res = await fetch('/api/admins/employees', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name ?? '',
        id: session?.user?.id,
      }),
    });

    const result = await res.json();
    setIsLoading(false);
    if (!res.ok && res.status !== 200) {
      return setErrMsg(result?.message);
    }

    return router.back();
  };
  return (
    <>
      {errMsg && (
        <div className="relative w-full flex items-center px-4 py-3 text-sm font-bold text-white bg-red-500 rounded-md" role="alert">
          <div className="flex justify-center items-center w-4 h-4 mr-2">
            <FontAwesomeIcon icon={faTriangleExclamation} />
          </div>
          <p>{errMsg}</p>
        </div>
      )}
      <form
        action=""
        method="post"
        onSubmit={(e) => {
          e.preventDefault();
          setIsLoading(true);
          setErrMsg('');
          setTimeout(() => {
            return handleSubmit();
          }, 500);
        }}
      >
        <div className="flex w-full">
          <div className="flex flex-col p-4 gap-3 w-full">
            <div className="flex flex-col ">
              <label htmlFor="name" className="text-base font-semibold mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="w-full rounded-md outline outline-posblue outline-1 px-3 py-1 hover:outline-posgray focus:outline-posgray transition duration-400"
                placeholder="Input name member"
              />
            </div>
            <div className="flex gap-3 justify-end ">
              <button type="reset" className="rounded-full px-5 py-2 bg-gray-300 p-2 flex justify-center items-center focus:text-white hover:bg-gray-400 focus:bg-gray-400 transition hover:text-white" onClick={() => router.back()}>
                <FontAwesomeIcon icon={faCaretLeft} />
                <p className="font-semibold">Back</p>
              </button>
              <button className="rounded-full  bg-posblue p-2 px-5 flex justify-center items-center focus:text-white hover:bg-teal-500 focus:bg-teal-500 transition hover:text-white font-semibold" type="submit">
                <FontAwesomeIcon icon={isLoading ? faSpinner : faPlus} spin={isLoading} />
                <p className="font-semibold"> &nbsp;Add</p>
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
