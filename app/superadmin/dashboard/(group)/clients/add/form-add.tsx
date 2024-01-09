'use client';

import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function FormAdd() {
  const [clientName, setClientName] = useState('');
  const [serviceDays, setServiceDays] = useState(30);
  const [status, setStatus] = useState(0);
  const router = useRouter();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await fetch('/api/superadmin/clients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_name: formData.get('client_name'),
        service_days: formData.get('service_days'),
      }),
    });
    const result = await res.json();
    console.log(result);
    if (res.status == 409) return setStatus(409);
    if (res.ok && res.status == 200) {
      return router.push('/superadmin/dashboard/clients');
    }
  };
  return (
    <form method="post" onSubmit={handleSubmit}>
      <div className="flex flex-col">
        {status === 409 && <span className="rounded bg-red-600 p-3 text-white">Client Already Exists</span>}
        <label htmlFor="client_name">Client Name</label>
        <input
          type="text"
          required
          id="client_name"
          name="client_name"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          className="outline outline-1 outline-gray-800 py-1 px-3 focus:outline-1 focus:outline-blue-600 transition rounded"
          placeholder="Input your Client Name"
        />
        <label htmlFor="service_days">Service Days</label>
        <input
          type="number"
          required
          id="service_days"
          name="service_days"
          value={serviceDays}
          onChange={(e) => setServiceDays(Number(e.target.value))}
          className="outline outline-1 outline-gray-800 py-1 px-3 focus:outline-1 focus:outline-blue-600 transition rounded"
          placeholder="Input your Client Name"
        />
        <button type="submit" className="bg-posblue my-3 p-2 text-black rounded hover:bg-teal-700 transition">
          Add
        </button>
        <button type="reset" className="rounded bg-posgray p-2 flex justify-center text-white items-center focus:text-white hover:bg-gray-500 focus:bg-gray-500 transition hover:text-white" onClick={() => router.back()}>
          <FontAwesomeIcon icon={faCaretLeft} />
          Back
        </button>
      </div>
    </form>
  );
}
