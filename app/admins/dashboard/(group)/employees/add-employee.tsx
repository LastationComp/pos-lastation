'use client';

import PosButton from '@/app/_components/PosButton';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import nProgress from 'nprogress';
import React from 'react';

export default function AddEmployee() {
  const router = useRouter();
  return (
    <PosButton
      icon={faPlus}
      onClick={() => {
        router.push('employees/add');
        nProgress.start();
      }}
    >
      <p className="font-semibold">Add Employee</p>
    </PosButton>
  );
}
