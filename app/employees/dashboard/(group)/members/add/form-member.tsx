'use client';

import { faCaretLeft, faPlus, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Swal from 'sweetalert2';

export default function FormMember({ session }: { session: any }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddMember = async () => {
    setIsLoading(true);
    const res = await fetch('/api/employee/members', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        phone: phone,
        email: email,
        client_code: session?.user?.client_code,
        idEmployee: session?.user?.id,
        license_key: session?.user?.license_key,
      }),
    });

    const result = await res.json();
    setIsLoading(false);
    if (!res.ok && res.status !== 200)
      return Swal.fire({
        title: 'Failed to Add Member',
        text: result?.message,
        icon: 'error',
      });

    await Swal.fire({
      title: 'Member Successfully Added!',
      icon: 'success',
    });
    router.push('/employees/dashboard/members');
  };

  const handleWarning = async (e: any) => {
    e.preventDefault();
    await Swal.fire({
      title: 'Are you sure to add?',
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton: true,
    }).then((result) => {
      if (result.isConfirmed) return handleAddMember();
    });
  };
  return (
    <form action="" method="post" onSubmit={handleWarning}>
      <div className="flex justify-center mx-3">
        <div className="flex w-screen flex-col mt-3 p-4 bg-white rounded-md shadow-lg">
          <div className="flex flex-col gap-3 px-3">
            <div className="flex flex-col">
              <label htmlFor="name" className="text-base font-semibold mb-2">
                Name
              </label>
              <input
                id="name"
                type="text"
                onChange={(e) => setName(e.target.value)}
                className=" rounded-md outline outline-posblue outline-1 px-3 py-1 hover:outline-posgray focus:outline-posgray transition duration-400"
                placeholder="Type Member Name..."
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="email" className="text-base font-semibold mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-md outline outline-posblue outline-1 px-3 py-1 hover:outline-posgray focus:outline-posgray transition duration-400"
                placeholder="member@gmail.com"
                required
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
                className="rounded-md outline outline-posblue outline-1 px-3 py-1 hover:outline-posgray focus:outline-posgray transition duration-400"
                placeholder="08**********"
                required
              />
            </div>
            <div className="flex flex-row gap-2 justify-end">
              <button type="submit" className="px-3 py-2 ml-2 bg-teal-300 text-black rounded-full hover:bg-teal-700 hover:text-white transition">
                <FontAwesomeIcon icon={isLoading ? faSpinner : faPlus} spin={isLoading} /> Add
              </button>
              <button type="reset" className="px-3 py-2 bg-slate-600 rounded-full hover:bg-slate-500 text-white transition" onClick={() => router.back()}>
                <FontAwesomeIcon icon={faCaretLeft} /> Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
