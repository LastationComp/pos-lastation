'use client';

import LoadingComponent from '@/app/_components/LoadingComponent';
import { fetcher } from '@/app/_lib/Fetcher';
import { faCaretLeft, faFloppyDisk, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import useSWR from 'swr';

export default function FormEdit({ customerCode, session }: { customerCode: string; session: any }) {
  const customer_code = customerCode;
  const { data } = useSWR(`/api/employee/members/${customer_code}`, fetcher);
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [point, setPoint] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleEditMember = async () => {
    setIsLoading(true);
    const pointMember = Number(point);
    const res = await fetch(`/api/employee/members/${customer_code}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        empID: session?.user?.id,
        name: name,
        phone: phone,
        email: email,
        point: pointMember,
      }),
    });

    const result = await res.json();

    setIsLoading(false);

    if (!res.ok && res.status !== 200)
      return Swal.fire({
        title: 'Failed to Update Member',
        text: result?.message,
        icon: 'error',
      });

    await Swal.fire({
      title: 'Member Successfully Updated!',
      icon: 'success',
    });
    router.push('/employees/dashboard/members');
  };

  const handleWarning = async (e: any) => {
    e.preventDefault();
    await Swal.fire({
      title: 'Are you sure to edit?',
      showConfirmButton: true,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) return handleEditMember();
      return;
    });
  };
  useEffect(() => {
    setName(data?.member?.name);
    setEmail(data?.member?.email);
    setPhone(data?.member?.phone);
    setPoint(data?.member?.point);
  }, [data]);

  if (!data) return <LoadingComponent />;
  return (
    <form action="" method="post" onSubmit={(e) => handleWarning(e)}>
      <div className="flex flex-col gap-3 px-4">
        <div className="flex flex-col">
          <label htmlFor="name" className="text-base font-semibold mb-2">
            Name
          </label>
          <input
            id="name"
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
            className=" rounded-md outline outline-posblue outline-1 px-3 py-1 hover:outline-posgray focus:outline-posgray transition duration-400"
            placeholder="Type Member Name"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="email" className="text-base font-semibold mb-2">
            Email
          </label>
          <input
            id="email"
            type="text"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className=" rounded-md outline outline-posblue outline-1 px-3 py-1 hover:outline-posgray focus:outline-posgray transition duration-400"
            placeholder="member@gmail.com"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="phone" className="text-base font-semibold mb-2">
            Phone
          </label>
          <input
            id="phone"
            type="text"
            onChange={(e) => setPhone(e.target.value)}
            value={phone}
            className="rounded-md outline outline-posblue outline-1 px-3 py-1 hover:outline-posgray focus:outline-posgray transition duration-400"
            placeholder="08**********"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="point" className="text-base font-semibold mb-2">
            Point
          </label>
          <input
            id="point"
            type="number"
            onChange={(e: any) => setPoint(e.target.value)}
            value={point}
            className="rounded-md outline outline-posblue outline-1 px-3 py-1 hover:outline-posgray focus:outline-posgray transition duration-400"
          />
        </div>
        <div className="flex flex-row justify-end py-2 px-4 gap-3">
          <button type="submit" className="px-3 py-2 ml-2 bg-teal-300 text-black rounded-full hover:bg-teal-700 hover:text-white transition">
            <FontAwesomeIcon icon={isLoading ? faSpinner : faFloppyDisk} spin={isLoading} /> Save
          </button>
          <button type="reset" className="px-3 py-2 bg-slate-600 rounded-full hover:bg-slate-500 text-white transition" onClick={() => router.back()}>
            <FontAwesomeIcon icon={faCaretLeft} /> Back
          </button>
        </div>
      </div>
    </form>
  );
}
