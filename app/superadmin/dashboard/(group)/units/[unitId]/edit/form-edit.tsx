'use client';

import LoadingComponent from '@/app/_components/LoadingComponent';
import { fetcher } from '@/app/_lib/Fetcher';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons/faCaretLeft';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import useSWR from 'swr';

export default function FormEdit({ unitId }: { unitId: string }) {
  const id = unitId;
  const { data } = useSWR('/api/superadmin/units/' + id, fetcher);

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [name, setName] = useState(data?.unit.name);
  const [errMsg, setErrMsg] = useState('');

  const handleSubmit = async (id: any) => {
    const res = await fetch('/api/superadmin/units/' + id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
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
    <div>
      {errMsg && <div className="bg-red-500 rounded text-white p-3">{errMsg}</div>}
      <form
        className="flex"
        action=""
        method="post"
        onSubmit={(e) => {
          e.preventDefault();
          setIsLoading(true);
          setErrMsg('');
          setTimeout(() => {
            return handleSubmit(data?.unit.id);
          }, 500);
        }}
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-col">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              onChange={(e) => setName(e.target.value)}
              value={name ?? data?.unit.name}
              className="rounded outline outline-posblue outline-1 px-3 py-1 hover:outline-posgray focus:outline-posgray transition duration-400"
            />
          </div>
          <button className="rounded bg-posblue p-2 flex justify-center items-center focus:text-white hover:bg-teal-500 focus:bg-teal-500 transition hover:text-white" type="submit">
            <FontAwesomeIcon icon={isLoading ? faSpinner : faPlus} spin={isLoading} />
            Save
          </button>
          <button type="reset" className="rounded bg-posgray p-2 flex justify-center text-white items-center focus:text-white hover:bg-gray-500 focus:bg-gray-500 transition hover:text-white" onClick={() => router.back()}>
            <FontAwesomeIcon icon={faCaretLeft} />
            Back
          </button>
        </div>
      </form>
    </div>
  );
}
