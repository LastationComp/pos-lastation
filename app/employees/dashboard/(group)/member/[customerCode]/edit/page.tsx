'use client';
import { faFloppyDisk, faCaretLeft, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import useSWR from 'swr';

export default function EmployeeEditMemberPage({ params }: { params: { customerCode: string } }) {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const customer_code = params.customerCode;
  const { data } = useSWR(`/api/employee/members/${customer_code}`, fetcher);

  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [point, setPoint] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleEditMember = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    const pointMember = Number(point);
    const res = await fetch(`/api/employee/members/${customer_code}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        phone: phone,
        email: email,
        point: pointMember,
      }),
    });

    setIsLoading(false);
    if (!res)
      Swal.fire({
        title: 'Failed to Update Member',
        icon: 'error',
      });
    Swal.fire({
      title: 'Member Successfully Updated!',
      icon: 'success',
    });
    router.push('/employees/dashboard/member');
  };

  useEffect(() => {
    setName(data?.member?.name);
    setEmail(data?.member?.email);
    setPhone(data?.member?.phone);
    setPoint(data?.member?.point);
  }, [data]);
  return (
    <>
      <form action="" method="post" onSubmit={(e) => handleEditMember(e)}>
        <div className="flex justify-center">
          <div className="flex flex-col w-[600px] mt-4 p-4 bg-white rounded-md shadow-lg">
            <p className="text-2xl font-semibold p-4">Edit Member</p>
            <div className="flex flex-col gap-3 px-6">
              <div className="flex flex-col">
                <label htmlFor="" className="text-base font-semibold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  className="w-[500px] h-[35px] rounded-md outline outline-posblue outline-1 px-3 py-1 hover:outline-posgray focus:outline-posgray transition duration-400"
                  placeholder="John Doe"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="text-base font-semibold mb-2">
                  Email
                </label>
                <input
                  type="text"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className="w-[500px] h-[35px] rounded-md outline outline-posblue outline-1 px-3 py-1 hover:outline-posgray focus:outline-posgray transition duration-400"
                  placeholder="example@gmail.com"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="text-base font-semibold mb-2">
                  Phone
                </label>
                <input
                  type="text"
                  onChange={(e) => setPhone(e.target.value)}
                  value={phone}
                  className="w-[500px] h-[35px] rounded-md outline outline-posblue outline-1 px-3 py-1 hover:outline-posgray focus:outline-posgray transition duration-400"
                  placeholder="08**********"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="text-base font-semibold mb-2">
                  Point
                </label>
                <input
                  type="number"
                  onChange={(e: any) => setPoint(e.target.value)}
                  value={point}
                  className="w-[500px] h-[35px] rounded-md outline outline-posblue outline-1 px-3 py-1 hover:outline-posgray focus:outline-posgray transition duration-400"
                />
              </div>
              <div className="flex flex-row justify-end py-2 px-4">
                <button type="reset" className="px-3 py-2 bg-slate-600 rounded-full hover:bg-slate-500 text-white transition" onClick={() => router.back()}>
                  <FontAwesomeIcon icon={faCaretLeft} /> Back
                </button>
                <button type="submit" className="px-3 py-2 ml-2 bg-teal-300 text-black rounded-full hover:bg-teal-700 hover:text-white transition">
                  <FontAwesomeIcon icon={isLoading ? faSpinner : faFloppyDisk} /> Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
